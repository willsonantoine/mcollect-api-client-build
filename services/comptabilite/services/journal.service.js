"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const journal_model_1 = __importDefault(require("../../../shared/models/journal.model"));
const compte_model_1 = __importDefault(require("../../../shared/models/compte.model"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
const operations_model_1 = __importDefault(require("../../../shared/models/operations.model"));
class JournalService {
    constructor() {
        this.create = async ({ createdAt, amount, currencyId, libelle, accountToId, accountFromId, operationId, }) => {
            const numberRef = await this.journalModel.count();
            console.log(`Creation du journal en cours ..... `);
            const createCredit = await this.journalModel.create({
                type: "CREDIT",
                amount,
                operationId,
                createdAt,
                accountIdFrom: accountFromId,
                accountIdTo: accountToId,
                currencyId,
                libelle,
                number: String(numberRef + 1),
            });
            console.log(`Credit Créer avec success ${createCredit.number}`);
            const createDebit = await this.journalModel.create({
                type: "DEBIT",
                amount,
                accountIdFrom: accountToId,
                accountIdTo: accountFromId,
                operationId,
                createdAt,
                currencyId,
                libelle,
                number: String(numberRef + 1),
            });
            console.log(`Credit Créer avec success ${createDebit.number}`);
            if (createCredit && createDebit) {
                //   calculer la balance
            }
        };
        this.findAll = async ({ accountFrom, accountTo, currencyId, limit = 10, number, offset = 0, date1, date2, operationId, search, order, }) => {
            const whereTarget = {
                createdAt: {
                    [sequelize_1.Op.and]: [
                        (0, sequelize_1.literal)(`DATE(JournalModel.createAt) >= '${date1}'`),
                        (0, sequelize_1.literal)(`DATE(JournalModel.createAt) <= '${date2}'`),
                    ],
                },
            };
            if (accountFrom) {
                whereTarget[sequelize_1.Op.or] = [
                    ...(whereTarget[sequelize_1.Op.or] || []),
                    { accountIdFrom: accountFrom },
                ];
            }
            if (currencyId) {
                whereTarget.currencyId = currencyId;
            }
            return this.journalModel.findAndCountAll({
                where: whereTarget,
                limit,
                offset,
                attributes: ["id", "number", "type", "amount", "libelle", "createdAt"],
                order: [["createdAt", order]],
                include: [
                    {
                        model: compte_model_1.default,
                        as: "accountFrom",
                        attributes: ["id", "name", "number"],
                    },
                    {
                        model: compte_model_1.default,
                        as: "accountTo",
                        attributes: ["id", "name", "number"],
                    },
                    { model: currency_model_1.default, as: "currency", attributes: ["id", "name"] },
                    {
                        model: operations_model_1.default,
                        as: "operation",
                        attributes: ["id", "number", "date_save"],
                    },
                ],
            });
        };
        this.getAvailableYearsInJournal = async () => {
            try {
                const result = await this.journalModel.findAll({
                    attributes: [[(0, sequelize_1.fn)("DISTINCT", (0, sequelize_1.fn)("YEAR", (0, sequelize_1.col)("createAt"))), "year"]],
                    raw: true,
                    order: [[(0, sequelize_1.literal)("year"), "desc"]], // Order the years in ascending order
                });
                // Extract the years from the result and convert them to numbers
                return result.map((item) => parseInt(item.year));
            }
            catch (error) {
                console.error("Error fetching available years:", error);
                return []; // Return an empty array in case of an error.  Important to handle this in your calling code.
            }
        };
        this.journalModel = journal_model_1.default;
    }
}
exports.default = JournalService;
