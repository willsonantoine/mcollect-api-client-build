"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const produit_model_1 = __importDefault(require("../../../shared/models/produit.model"));
class ProduitService {
    constructor() {
        this.createProduit = async (data) => {
            return await this.produitModel.create(data);
        };
        this.updateProduit = async (id, data) => {
            return await this.produitModel.update(data, { where: { id } });
        };
        this.deleteProduit = async (id) => {
            return await this.produitModel.destroy({ where: { id } });
        };
        this.findProduit = async (id) => {
            return await this.produitModel.findOne({ where: { id } });
        };
        this.findAllProduit = async ({ limit, offset, search }) => {
            return await this.produitModel.findAll({ limit, offset, order: [['createdAt', 'desc'], ['updatedAt', 'desc']] });
        };
        this.produitModel = produit_model_1.default;
    }
}
exports.default = ProduitService;
