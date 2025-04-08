"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
const operations_service_1 = __importDefault(require("../services/operations.service"));
const billetage_service_1 = __importDefault(require("../services/billetage.service"));
class OperationsController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { accountFromId, accountToId, amount, amount_in_letter, currencyId, date_save, memberId, motif, type, transactionId, succursaleId, isRemboursement, creditId, } = req.body;
                const user = req.user;
                const number = await this.operationsService.getNextNumber();
                const id = (0, vars_1.generateUniqueId)();
                const { observation, Operation, status } = await this.operationsService.create({
                    id,
                    accountFromId,
                    accountToId,
                    amount,
                    amount_in_letter,
                    currencyId,
                    date_save,
                    memberId,
                    motif,
                    number,
                    type,
                    userCreatedId: user.id,
                    transactionId: transactionId ? transactionId : null,
                    succursaleId,
                    isRemboursement,
                }, creditId);
                if (status) {
                    if (Operation) {
                        const billetages = req.body.billetage || [];
                        console.log(billetages);
                        if (billetages.length > 0) {
                            await this.billetageService.createOperationBilletage(Operation.id, billetages);
                        }
                    }
                    (0, response_util_1.setResponse)({ res, data: Operation, message: observation });
                }
                else {
                    (0, response_util_1.setResponse)({
                        res,
                        message: observation,
                        statusCode: 400,
                    });
                }
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
        this.deleteOperation = async (req, res) => {
            try {
                const { id } = req.params;
                const user = req.user;
                const result = await this.operationsService.deleteOperations(id, user.id);
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
        this.ValidateOperation = async (req, res) => {
            try {
                const { id } = req.params;
                const user = req.user;
                const op = await this.operationsService.findOperationById(id);
                if (op && op.status === 1) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: "Cette opération est déja validé",
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.operationsService.validateOperation(id, user.id);
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
        this.findAllOperations = async (req, res) => {
            try {
                const { search, date1, date2, currencyId, type, accountId = "", status, } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const status_ = status === "true" ? true : status === "false" ? false : undefined;
                console.log(req.query.status);
                console.log(status_);
                const result = await this.operationsService.findAll({
                    currencyId,
                    date1,
                    limit,
                    offset,
                    search,
                    status: status_,
                    date2,
                    type,
                    accountId,
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
        this.operationsService = new operations_service_1.default();
        this.billetageService = new billetage_service_1.default();
    }
}
exports.default = new OperationsController();
