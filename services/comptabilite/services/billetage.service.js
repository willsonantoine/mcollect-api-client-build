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
        // Assuming BilletageService class context...
        this.getBilletageHistorySummary = async ({ type, currencyId = "", date, userCreatedId, }) => {
            // --- Input Validation (Recommended) ---
            // Add checks here to ensure 'date' is a valid date format, etc.
            // before using it in a literal to prevent SQL injection risks.
            // Example: Use a library like date-fns or moment to parse/validate 'date'
            // const validatedDate = parseAndValidateDate(date); // Implement this function
            // if (!validatedDate) {
            //   throw new Error("Invalid date format");
            // }
            // const formattedDate = validatedDate.toISOString().split('T')[0]; // Get YYYY-MM-DD
            // --- End Input Validation ---
            // Where clause for the INNER JOIN on OperationModel
            const whereOperations = {
                // Use Sequelize's date functions for safety and portability if possible
                // If date_save is DATETIME, you can use:
                [sequelize_1.Op.and]: [
                    sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("operation.date_save")), "=", date), // Use validated/formatted date
                ],
                // If date_save is already DATE type, it's simpler:
                // date_save: date, // Use validated/formatted date
                etat: 1, // Changed from status to etat based on your SQL query
            };
            // Dynamically add conditions to the operation's where clause
            if (type) {
                whereOperations.type = type;
            }
            if (userCreatedId) {
                // Assuming the association alias is 'userCreated' and the foreign key is 'user_create'
                whereOperations["$userCreated.id$"] = userCreatedId; // Correct way to reference associated column in where
                // Alternative if foreign key is directly on OperationModel:
                // whereOperations.user_create = userCreatedId;
            }
            // Where clause specifically for the CurrencyModel association (if filtering by currency)
            const whereCurrency = {};
            if (currencyId) {
                // Apply currency filter on the JOIN condition or a top-level where if appropriate
                // For filtering the main results by currency, add it here:
                whereCurrency.id = currencyId;
            }
            return await operations_billetage_model_1.default.findAll({
                attributes: [
                    [(0, sequelize_1.col)("currency.id"), "currencyId"],
                    // Include designation, will be added to GROUP BY
                    [(0, sequelize_1.col)("currency.designation"), "currencyName"],
                    [(0, sequelize_1.col)("operation.type"), "operationType"],
                    // Use the foreign key name on OperationModel if 'userCreatedId' isn't directly available
                    // Or rely on the association join
                    [(0, sequelize_1.col)("operation->userCreated.id"), "userCreatedId"], // Correct way to access nested association column
                    // Include username, will be added to GROUP BY
                    [(0, sequelize_1.col)("operation->userCreated.username"), "userCreatedUsername"], // Correct way to access nested association column
                    // Assuming 'valeur' is directly on OperationsBilletageModel
                    [(0, sequelize_1.col)("OperationsBilletageModel.valeur"), "value"],
                    // Aggregate function
                    [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("OperationsBilletageModel.qte")), "totalQuantity"],
                ],
                include: [
                    {
                        model: currency_model_1.default,
                        as: "currency",
                        attributes: [], // No extra attributes needed from here
                        where: whereCurrency, // Apply currency filtering here if needed
                        required: !!currencyId, // Make JOIN required only if filtering by currencyId
                    },
                    {
                        model: operations_model_1.default,
                        as: "operation",
                        where: whereOperations, // Apply filters for operations here
                        attributes: [], // No extra attributes needed from here
                        required: true, // Usually INNER JOIN based on your SQL
                        include: [
                            {
                                model: users_model_1.default,
                                as: "userCreated", // Ensure this alias matches your association definition
                                attributes: [], // No extra attributes needed from here
                                // Making this required depends on if you *only* want operations with valid users
                                // Set to 'false' (LEFT JOIN) if you want operations even if user is deleted/missing
                                required: false, // Based on your SQL LEFT OUTER JOIN
                            },
                        ],
                    },
                ],
                group: [
                    // Add ALL non-aggregated selected columns to the GROUP BY clause
                    (0, sequelize_1.col)("currency.id"),
                    (0, sequelize_1.col)("currency.designation"), // <-- ADDED
                    (0, sequelize_1.col)("operation.type"),
                    (0, sequelize_1.col)("operation->userCreated.id"), // <-- Use association path
                    (0, sequelize_1.col)("operation->userCreated.username"), // <-- Use association path & ADDED
                    (0, sequelize_1.col)("OperationsBilletageModel.valeur"), // Group by 'valeur' from the base model
                ],
                order: [
                    // Correct ordering syntax for associated columns
                    [sequelize_1.Sequelize.literal("`operation`.`type`"), "ASC"],
                    [sequelize_1.Sequelize.literal("`currency`.`id`"), "ASC"],
                    // Simpler if models/aliases don't clash:
                    // ['operation', 'type', 'ASC'],
                    // ['currency', 'id', 'ASC'],
                ],
                raw: true, // Return raw data
                // subQuery: false // Add this if complex WHERE clauses on includes cause issues
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
