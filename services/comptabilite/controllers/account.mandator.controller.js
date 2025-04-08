"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_mendator_service_1 = __importDefault(require("../services/account.mendator.service"));
const response_util_1 = require("../../../shared/utils/response.util");
class AccountMandatorController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const userId = req.user.id;
                const result = await this.accountMendatorService.create(Object.assign(Object.assign({}, req.body), { userCreatedId: userId }));
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
        this.update = async (req, res) => {
            try {
                const userId = req.user.id;
                const id = req.params.id;
                const result = await this.accountMendatorService.update(id, Object.assign(Object.assign({}, req.body), { userCreatedId: userId }));
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
        this.deleteItem = async (req, res) => {
            try {
                const userId = req.user.id;
                await this.accountMendatorService.deleteItem(req.params.id, userId);
                (0, response_util_1.setResponse)({ res });
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
        this.findAll = async (req, res) => {
            try {
                const accountId = req.params.accountId;
                const { type } = req.query;
                const result = await this.accountMendatorService.findAll(accountId, type);
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
        this.accountMendatorService = new account_mendator_service_1.default();
    }
}
exports.default = new AccountMandatorController();
