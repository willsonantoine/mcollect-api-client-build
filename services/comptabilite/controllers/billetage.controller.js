"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const billetage_service_1 = __importDefault(require("../services/billetage.service"));
const vars_1 = require("../../../shared/utils/vars");
const response_util_1 = require("../../../shared/utils/response.util");
class BilletageController {
    constructor() {
        this.findAll = async (req, res) => {
            try {
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.billetageService.getAllBilletage({
                    limit,
                    offset,
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
        this.getBilletageByOperationId = async (req, res) => {
            const operationId = req.params.operationId;
            try {
                const result = await this.billetageService.getBilletageByIoperations(operationId);
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
        this.getBilletageHistory = async (req, res) => {
            try {
                const { date, type, userCreatedId, currencyId } = req.query;
                const result = await this.billetageService.getBilletageHistorySummary({
                    type,
                    userCreatedId,
                    date,
                    currencyId,
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
        this.getBilletage = async (req, res) => {
            try {
                const { currencyId = "" } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.billetageService.getStockBilletage({
                    offset,
                    limit,
                    currencyId,
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
        this.updateBilletage = async (req, res) => {
            try {
                const userUpdateId = req.user.id;
                const { qte, id, observation } = req.body;
                const result = await this.billetageService.updateBilletage({
                    userUpdateId,
                    qte,
                    id,
                    observation,
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
        this.billetageService = new billetage_service_1.default();
    }
}
exports.default = new BilletageController();
