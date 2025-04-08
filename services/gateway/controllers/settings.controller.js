"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../../shared/utils/response.util");
const settings_service_1 = __importDefault(require("../services/settings.service"));
class SettingsController {
    constructor() {
        this.makeCorrectionToModal = async (req, res) => {
            try {
                await this.settingService.makeCorrectionToStructure();
                (0, response_util_1.setResponse)({
                    res,
                    message: `La correction s'est produite avec success`,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une interne erreur s'est produit`,
                    statusCode: 500,
                });
            }
        };
        this.changeEntreprseInformations = async (req, res) => {
            try {
                const data = req.body;
                data.smsCurrencyId = data.smsCurrencyId || null;
                data.smsAccountId = data.smsAccountId || null;
                data.partSocialAccountId = data.partSocialAccountId || null;
                data.memberAcountClassId = data.memberAcountClassId || null;
                const result = await this.settingService.updateEntrepriseInformations(data);
                (0, response_util_1.setResponse)({
                    res,
                    message: `Mise en jour réussie avec success`,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une interne erreur s'est produit`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getEntrepriseInformations = async (req, res) => {
            try {
                const result = await this.settingService.getEntrepriseInformations();
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une interne erreur s'est produit`,
                    statusCode: 500,
                });
            }
        };
        this.getSuccursale = async (req, res) => {
            try {
                const result = await this.settingService.getSuccursale();
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une interne erreur s'est produit`,
                    statusCode: 500,
                });
            }
        };
        this.settingService = new settings_service_1.default();
    }
}
exports.default = new SettingsController();
