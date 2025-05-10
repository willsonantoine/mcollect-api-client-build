"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commande_service_1 = __importDefault(require("../services/commande.service"));
const commande_model_1 = require("../../../shared/models/commande.model");
const response_util_1 = require("../../../shared/utils/response.util");
const web_service_1 = __importDefault(require("../../storage/services/web.service"));
const vars_1 = require("../../../shared/utils/vars");
class CommandeControllers {
    constructor() {
        this.createCommande = async (req, res) => {
            var _a, _b;
            try {
                const { token } = req.params;
                const siteExist = await this.siteSevice.SiteFindByToken(token);
                if (!siteExist) {
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 400,
                        message: "Ce site web n'existe pas",
                        data: null,
                    });
                    return;
                }
                const { payementMethod, phoneNumber, lines } = req.body;
                const userId = req.user.id;
                const commandeLine = lines;
                if (lines && commandeLine.length === 0) {
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 400,
                        message: "Aucune ligne de commande fournie",
                        data: null,
                    });
                    return;
                }
                const linesMap = await this.commandeService.getComandeLinesMaped(commandeLine);
                const currencyId = (_a = linesMap[0].produit) === null || _a === void 0 ? void 0 : _a.currencyId;
                const amount = this.commandeService.getAmountTotal(linesMap);
                const countCommande = await this.commandeService.countCommandes(siteExist.id);
                const commande = await this.commandeService.create({
                    userId,
                    payementMethod,
                    status: commande_model_1.CommandeStatus.PENDING,
                    amount: amount,
                    currencyId: currencyId || "",
                    phoneNumber,
                    siteId: siteExist.id,
                    commadeNumber: `COM-${countCommande + 1}.${new Date().getFullYear()}.${(0, vars_1.generateOtp)()}`,
                });
                for (const line of linesMap) {
                    await this.commandeService.createLine({
                        commandeId: commande.id,
                        produitId: line.productId,
                        quantity: line.quantity,
                        price: ((_b = line.produit) === null || _b === void 0 ? void 0 : _b.price_max) || 0,
                    });
                }
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 200,
                    message: "Commande créée avec succès",
                    data: commande,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: "Erreur lors de la création de la commande",
                    data: null,
                    error: error,
                });
            }
        };
        this.getCommandes = async (req, res) => {
            try {
                const { token } = req.params;
                const userId = req.user.id;
                const siteWeb = await this.siteSevice.SiteFindByToken(token);
                const result = await this.commandeService.getCommandes({
                    siteId: (siteWeb === null || siteWeb === void 0 ? void 0 : siteWeb.id) || "",
                    userId,
                });
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 200,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: "Erreur lors de la création de la commande",
                    data: null,
                    error: error,
                });
            }
        };
        this.getCommandesInAdmin = async (req, res) => {
            try {
                const { siteId } = req.query;
                const result = await this.commandeService.getCommandesAdmin({ siteId });
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 200,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: "Erreur lors du chargement de la commande",
                    data: null,
                    error: error,
                });
            }
        };
        this.commandeService = new commande_service_1.default();
        this.siteSevice = new web_service_1.default();
    }
}
exports.default = new CommandeControllers();
