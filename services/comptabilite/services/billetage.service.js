"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const billetage_model_1 = __importDefault(require("../../../shared/models/billetage.model"));
const billetage_history_model_1 = __importDefault(require("../../../shared/models/billetage.history.model"));
const operations_billetage_model_1 = __importDefault(require("../../../shared/models/operations.billetage.model"));
const sequelize_1 = require("sequelize");
const operations_model_1 = __importDefault(require("../../../shared/models/operations.model"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
const vars_1 = require("../../../shared/utils/vars");
class BilletageService {
    constructor() {
        this.createHistory = async (data) => {
            return this.billetageHistory.create(data);
        };
        this.getBilletageByIoperations = async (operationId) => {
            return await this.operationBilletage.findAndCountAll({
                where: { operationId },
                attributes: ["id", "value", "qte"],
                include: [
                    { model: currency_model_1.default, attributes: ["id", "name"], as: "currency" },
                ],
            });
        };
        this.getAllBilletage = async ({ offset = 0, limit = 10, }) => {
            return await this.billetageModel.findAndCountAll({
                offset,
                limit,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                    ["currencyId", "asc"],
                ],
            });
        };
        this.createOperationBilletage = async (operationId, billetage) => {
            for (const item of billetage) {
                await this.operationBilletage.create({
                    id: (0, vars_1.generateUniqueId)(),
                    operationId,
                    number: item.number,
                    value: item.value,
                    currencyId: item.currencyId,
                });
            }
        };
        this.cumulateBilletage = async (operationId, type) => {
            const operationsBilletage = await this.operationBilletage.findAll({
                where: { operationId },
            });
            if (!operationsBilletage || operationsBilletage.length === 0) {
                console.warn(`No operations found for operationId: ${operationId}. Skipping billetage update.`);
                return; // Exit early if no operations found.  Prevents unnecessary database operations.
            }
            const isEntryOrDeposit = type === "ENTREE" || type === "DEPOT";
            // Prepare updates in bulk for better performance
            const updates = operationsBilletage.map(async (item) => {
                if (!item)
                    return; // Skip null/undefined items
                const billetage = await this.billetageModel.findOne({
                    where: {
                        currencyId: item.currencyId || "", // Provide a default value
                        value: item.value,
                    },
                });
                if (billetage) {
                    // Provide a default value if item.number is potentially null or undefined
                    const itemNumber = item.number || 0;
                    const newNumber = isEntryOrDeposit
                        ? billetage.number + itemNumber
                        : billetage.number - itemNumber;
                    return this.billetageModel.update({ number: newNumber }, {
                        where: { id: billetage.id },
                        returning: true,
                    });
                }
                else {
                    // Log or handle the case where the billetage is not found.  Very important to know when this happens.
                    console.warn(`Billetage not found for currencyId: ${item.currencyId}, value: ${item.value}.  Skipping update.`);
                    return;
                }
            });
            // Execute all updates concurrently using Promise.all
            await Promise.all(updates);
        };
        this.getBilletageHistorySummary = async ({ type, currencyId = "", date, userCreatedId, }) => {
            const whereOperations = {
                date_save: (0, sequelize_1.literal)(`DATE(date_save) = '${date}'`),
                status: 1,
            };
            if (type) {
                whereOperations.type = type;
            }
            if (userCreatedId) {
                whereOperations.userCreatedId = userCreatedId;
            }
            if (currencyId) {
                whereOperations.currencyId = currencyId;
            }
            return await operations_billetage_model_1.default.findAll({
                // Use OperationsBilletageModel
                attributes: [
                    [(0, sequelize_1.col)("currency.id"), "currencyId"], // Group by currency ID
                    [(0, sequelize_1.col)("currency.designation"), "currencyName"], // optional:  get the name for convenience
                    [(0, sequelize_1.col)("operation.type"), "operationType"], // Group by operation type
                    [(0, sequelize_1.col)("operation.userCreated.id"), "userCreatedId"], // Group by user ID
                    [(0, sequelize_1.col)("operation.userCreated.username"), "userCreatedUsername"], // optional: get the username for convenience
                    [(0, sequelize_1.col)("valeur"), "value"], // Include the 'valeur' column directly
                    [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("qte")), "totalQuantity"], // Sum the quantities for each value
                ],
                include: [
                    {
                        model: currency_model_1.default, // Ensure correct import and usage of CurrencyModel
                        as: "currency",
                        attributes: [], // Only need ID and designation if included
                    },
                    {
                        model: operations_model_1.default,
                        as: "operation",
                        where: whereOperations,
                        attributes: [], // Don't return all the operation attributes, we only need those specified for the grouping
                        include: [
                            {
                                model: users_model_1.default, // Use UsersModel here and ensure it's imported correctly
                                as: "userCreated",
                                attributes: [], // Only need ID and username if included
                            },
                        ],
                    },
                ],
                group: [
                    (0, sequelize_1.col)("currency.id"),
                    (0, sequelize_1.col)("operation.type"),
                    (0, sequelize_1.col)("valeur"), // Group by 'valeur'
                    (0, sequelize_1.col)("operation.userCreated.id"),
                ],
                order: [
                    ["operation", "type", "ASC"], // Order by operation.type ascending
                    ["currency", "id", "ASC"], // Order by currency.id ascending
                ],
                raw: true, // Return raw JSON results instead of Sequelize model instances
            });
        };
        this.getStockBilletage = async ({ limit, offset, currencyId, }) => {
            const whereTarget = {};
            if (currencyId) {
                whereTarget.currencyId = currencyId;
            }
            const total = await this.calculateCurrencyTotals(whereTarget);
            const list = await this.billetageModel.findAndCountAll({
                where: whereTarget,
                offset,
                limit,
                include: [
                    {
                        model: currency_model_1.default,
                        as: "currency",
                        attributes: ["id", "name", "description"],
                    },
                ],
                order: [
                    [{ model: currency_model_1.default, as: "currency" }, "name", "desc"], // Order by currency name (descending)
                    ["value", "asc"], // Order by billetage value (ascending)
                ],
            });
            return { total, list };
        };
        this.calculateCurrencyTotals = async (whereTarget) => {
            return await this.billetageModel.findAll({
                attributes: [
                    "currencyId",
                    [(0, sequelize_1.literal)("SUM(valeur * qte)"), "totalAmount"], // Calculate valeur * qte
                    [(0, sequelize_1.col)("currency.designation"), "currencyName"], // Include currency name
                ],
                where: whereTarget,
                group: ["currencyId", "currency.designation"], // Group by both currencyId and currency name
                raw: true, // Return plain JavaScript objects
                include: [{ model: currency_model_1.default, as: "currency", attributes: [] }], // Include CurrencyModel for accessing name but exclude other fields
            });
        };
        this.updateBilletage = async ({ userUpdateId, observation, qte, id, }) => {
            const billetage = await this.billetageModel.findByPk(id);
            if (billetage) {
                const obs = `${(0, vars_1.getDateTimeFull)()}: Ancienne quantité : ${billetage.number};Nouvelle quantité : ${qte} ${observation} ::: ${billetage.observation}`;
                await this.billetageModel.update({ number: qte, user_update: userUpdateId, observation: obs }, {
                    where: { id },
                    returning: true,
                });
            }
        };
        this.billetageHistory = billetage_history_model_1.default;
        this.billetageModel = billetage_model_1.default;
        this.operationBilletage = operations_billetage_model_1.default;
    }
}
exports.default = BilletageService;
