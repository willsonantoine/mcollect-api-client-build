"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const journal_service_1 = __importDefault(require("../services/journal.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
class JournalController {
    constructor() {
        this.findAll = async (req, res) => {
            try {
                const { date1, date2, accountFrom, accountTo, currencyId, number, operationId, search, order, } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.journalService.findAll({
                    date1,
                    date2,
                    limit,
                    accountFrom,
                    accountTo,
                    currencyId,
                    number,
                    offset,
                    operationId,
                    search,
                    order,
                });
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getAvailableYearsInJournal = async (req, res) => {
            try {
                const result = await this.journalService.getAvailableYearsInJournal();
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.journalService = new journal_service_1.default();
    }
}
exports.default = new JournalController();
