"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthSynchro = void 0;
const entreprise_model_1 = __importDefault(require("../models/entreprise.model"));
const response_util_1 = require("../utils/response.util");
const succursale_model_1 = __importDefault(require("../models/succursale.model"));
const AuthSynchro = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const serviceId = req.headers.serviceid;
        const serviceName = req.headers.servicename;
        const [succursale] = await succursale_model_1.default.findCreateFind({
            where: { name: serviceName, id: serviceId },
        });
        const org = await entreprise_model_1.default.findOne({
            where: { desktop_synchro_token: authHeader },
        });
        if (!org) {
            (0, response_util_1.setResponse)({
                res,
                message: "Requette non autorisée",
                statusCode: 401,
            });
            return;
        }
        req.succursale = succursale;
        next();
    }
    catch (error) {
        (0, response_util_1.setResponse)({
            res,
            error,
            statusCode: 500,
        });
    }
};
exports.AuthSynchro = AuthSynchro;
