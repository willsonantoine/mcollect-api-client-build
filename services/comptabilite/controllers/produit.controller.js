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
                const userCreatedId = req.user.id;
                const data = req.body;
                const produit = await this.produitService.createProduit(Object.assign(Object.assign({}, data), { userCreatedId }));
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
        this.updateProduit = async (req, res) => {
            try {
                const userUpdatedId = req.user.id;
                const id = req.params.id;
                const data = req.body;
                const produit = await this.produitService.updateProduit(id, Object.assign(Object.assign({}, data), { userUpdatedId }));
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
        this.deleteProduit = async (req, res) => {
            try {
                const userDeletedId = req.user.id;
                const id = req.params.id;
                const produit = await this.produitService.deleteProduit(id, userDeletedId);
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
                const { search, subCategoryId, siteId, type = "" } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const produit = await this.produitService.findAllProduit({
                    type: String(type),
                    limit,
                    offset,
                    search: String(search),
                    SubCategoryId: String(subCategoryId),
                    siteId: String(siteId),
                });
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
        // Categrory Produit
        this.createCategoryProduit = async (req, res) => {
            try {
                const userCreatedId = req.user.id;
                const data = req.body;
                const exist = await this.produitService.findProduitCategoryByName(req.body.name);
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Cette catégorie existe déjà`,
                        statusCode: 400,
                    });
                    return;
                }
                const produit = await this.produitService.createProduitCategory(Object.assign(Object.assign({}, data), { userCreatedId }));
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
        this.updateCategoryProduit = async (req, res) => {
            try {
                const userUpdatedId = req.user.id;
                const id = req.params.id;
                const data = req.body;
                const produit = await this.produitService.uppdateProduitCategory(id, Object.assign(Object.assign({}, data), { userUpdatedId }));
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
        this.deleteCategoryProduit = async (req, res) => {
            try {
                const userDeletedId = req.user.id;
                const id = req.params.id;
                const produit = await this.produitService.deleteProduitCategory(id, userDeletedId);
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
        this.loadCategoryProduit = async (req, res) => {
            try {
                const { search } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const produit = await this.produitService.findAllProduitCategory({
                    limit,
                    offset,
                    search: String(search),
                });
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
        // Categrory Produit
        this.createSubCategoryProduit = async (req, res) => {
            try {
                const userCreatedId = req.user.id;
                const data = req.body;
                const produit = await this.produitService.createSubCategoryProduit(Object.assign(Object.assign({}, data), { userCreatedId }));
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
        this.updateSubCategoryProduit = async (req, res) => {
            try {
                const userUpdatedId = req.user.id;
                const id = req.params.id;
                const data = req.body;
                const produit = await this.produitService.updateSubCategoryProduit(id, Object.assign(Object.assign({}, data), { userUpdatedId }));
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
        this.deleteSubCategoryProduit = async (req, res) => {
            try {
                const userDeletedId = req.user.id;
                const id = req.params.id;
                const produit = await this.produitService.deleteSubCategoryProduit(id, userDeletedId);
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
        this.loadSubCategoryProduit = async (req, res) => {
            try {
                const { search, categoryId, siteId } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const produit = await this.produitService.findAllSubCategoryProduct({
                    limit,
                    offset,
                    search: String(search),
                    categoryId: String(categoryId),
                });
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
