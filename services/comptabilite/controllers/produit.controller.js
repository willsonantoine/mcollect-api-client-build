"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../../shared/utils/response.util");
const produit_service_1 = __importDefault(require("../services/produit.service"));
const vars_1 = require("../../../shared/utils/vars");
class ProduitController {
    constructor() {
        this.createProduit = async (req, res) => {
            try {
                const data = req.body;
                const produit = await this.produitService.createProduit(data);
                (0, response_util_1.setResponse)({ res, data: produit });
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
        this.loadProduit = async (req, res) => {
            try {
                const { search } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const produit = await this.produitService.findAllProduit({ limit, offset, search: String(search) });
                (0, response_util_1.setResponse)({ res, data: produit });
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
        this.produitService = new produit_service_1.default();
    }
}
exports.default = new ProduitController();
