"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_public_service_1 = __importDefault(require("../services/web.public.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
class WebPublicController {
    constructor() {
        this.getSiteData = async (req, res) => {
            try {
                const { token } = req.params;
                const ip = req.ip; // Utilise req.ip et type correctement
                const userAgent = req.headers["user-agent"]; // Type correctement
                const result = await this.webPublicService.getSiteInfos({ token });
                if (!result) {
                    // Le site n'a pas été trouvé avec le token
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 404, // Not Found
                        message: "Site non trouvé avec ce token.",
                    });
                    return;
                }
                // Ne crée la visite que si le site est trouvé
                this.webPublicService.createVisite({ ip, userAgent, siteId: result.id });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                // Type l'erreur avec "any" ou "Error"
                console.error("Erreur lors de la récupération des informations du site :", error);
                // Gérer différents types d'erreurs si possible
                let statusCode = 500;
                let message = "Erreur interne du serveur.";
                if (error.name === "InvalidTokenError") {
                    // Exemple d'erreur personnalisée
                    statusCode = 400; // Bad Request
                    message = "Token invalide.";
                }
                (0, response_util_1.setResponse)({
                    res,
                    statusCode,
                    error: { message }, // Envoie un objet d'erreur avec un message générique
                });
            }
        };
        this.getSiteBlogs = async (req, res) => {
            try {
                const { token, categoryId } = req.params;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.webPublicService.getBlogs({
                    token,
                    categoryId,
                    limit,
                    offset,
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getSiteBlocs = async (req, res) => {
            try {
                const { token } = req.params;
                const result = await this.webPublicService.getBlocs({ token });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getSiteCategories = async (req, res) => {
            try {
                const { token } = req.params;
                const result = await this.webPublicService.getCategories({ token });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getBlogsByUrl = async (req, res) => {
            try {
                const { token, url } = req.params;
                const result = await this.webPublicService.getBlogsByUrl({ token, url });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.webPublicService = new web_public_service_1.default();
    }
}
exports.default = new WebPublicController();
