"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const produit_category_model_copy_1 = __importDefault(require("../../../shared/models/produit.category.model copy"));
const produit_model_1 = __importDefault(require("../../../shared/models/produit.model"));
const produit_stock_model_1 = __importDefault(require("../../../shared/models/produit.stock.model"));
const produit_sub_category_model_1 = __importDefault(require("../../../shared/models/produit.sub.category.model"));
class ProduitService {
    constructor() {
        this.getCategId = async (name) => {
            const [categ] = await this.produitCateg.findCreateFind({ where: { name } });
            return categ.id;
        };
        this.getSubCategId = async ({ categoryId, name, }) => {
            const [subCateg] = await this.produitSubCateg.findCreateFind({
                where: { name, categoryId },
            });
            return subCateg.id;
        };
        this.getProductId = async ({ name, subCategoryId, }) => {
            const [prod] = await this.produitModel.findCreateFind({
                where: { name, subCategoryId },
            });
            return prod.id;
        };
        this.findById = async (id) => {
            return await this.produitModel.findByPk(id);
        };
        this.update = async (id, data) => {
            return await this.produitModel.update(data, { where: { id } });
        };
        this.create = async (data) => {
            return await this.produitModel.create(data);
        };
        this.createStock = async (data) => {
            return await this.productStock.create(data);
        };
        this.findByIdStock = async (id, succursaleId) => {
            return await this.productStock.findOne({ where: { id, succursaleId } });
        };
        this.updateStock = async (id, data) => {
            return await this.productStock.update(data, { where: { id } });
        };
        this.produitCateg = produit_category_model_copy_1.default;
        this.produitSubCateg = produit_sub_category_model_1.default;
        this.produitModel = produit_model_1.default;
        this.productStock = produit_stock_model_1.default;
    }
}
exports.default = ProduitService;
