"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const produit_category_model_1 = __importDefault(require("../../../shared/models/produit.category.model"));
const produit_model_1 = __importDefault(require("../../../shared/models/produit.model"));
const produit_subcategory_model_1 = __importDefault(require("../../../shared/models/produit.subcategory.model"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
class ProduitService {
    constructor() {
        this.createProduit = async (data) => {
            return await this.produitModel.create(data);
        };
        this.updateProduit = async (id, data) => {
            return await this.produitModel.update(data, { where: { id } });
        };
        this.deleteProduit = async (id, userDeletedId) => {
            await this.produitModel.update({ userDeletedId }, { where: { id } });
            return await this.produitModel.destroy({ where: { id } });
        };
        this.findProduit = async (id) => {
            return await this.produitModel.findOne({ where: { id } });
        };
        this.findAllProduit = async ({ limit, offset, search, SubCategoryId, siteId, type, }) => {
            const whereTarget = {};
            if (SubCategoryId) {
                whereTarget.subCategoryId = SubCategoryId;
            }
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            if (type) {
                whereTarget.type = type;
            }
            if (siteId) {
                whereTarget.siteId = siteId;
            }
            return await this.produitModel.findAndCountAll({
                where: whereTarget,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                limit,
                offset,
                include: [
                    {
                        model: produit_subcategory_model_1.default,
                        as: "subCategory",
                        include: [{ model: produit_category_model_1.default, as: "category" }],
                    },
                    {
                        model: users_model_1.default,
                        as: "userCreated",
                        attributes: ["id", "username", "avatar"],
                    },
                    {
                        model: users_model_1.default,
                        as: "userUpdated",
                        attributes: ["id", "username", "avatar"],
                    },
                    { model: currency_model_1.default, as: "currency", attributes: ["id", "name"] },
                ],
            });
        };
        // Category Produit
        this.createProduitCategory = async (data) => {
            return await this.produitCategory.create(data);
        };
        this.uppdateProduitCategory = async (id, data) => {
            return await this.produitCategory.update(data, { where: { id } });
        };
        this.deleteProduitCategory = async (id, userDeletedId) => {
            await this.produitCategory.update({ userDeletedId }, { where: { id } });
            return await this.produitCategory.destroy({ where: { id } });
        };
        this.findAllProduitCategory = async ({ limit, offset, search, siteId, }) => {
            const whereTarget = {};
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            if (siteId) {
                whereTarget.siteId = siteId;
            }
            return await this.produitCategory.findAndCountAll({
                where: whereTarget,
                limit,
                offset,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
            });
        };
        this.findProduitCategoryByName = async (name) => {
            return await this.produitCategory.findOne({ where: { name } });
        };
        // Sous Category
        this.createSubCategoryProduit = async (data) => {
            return await this.produitSubCategory.create(data);
        };
        this.updateSubCategoryProduit = async (id, data) => {
            return await this.produitSubCategory.update(data, { where: { id } });
        };
        this.deleteSubCategoryProduit = async (id, userCreatedId) => {
            await this.produitCategory.update({ userCreatedId }, { where: { id } });
            return await this.produitSubCategory.destroy({ where: { id } });
        };
        this.findAllSubCategoryProduct = async ({ limit, offset, search, categoryId, siteId, }) => {
            const whereTarget = {};
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            if (categoryId) {
                whereTarget.categoryId = categoryId;
            }
            if (siteId) {
                whereTarget.siteId = siteId;
            }
            return await this.produitSubCategory.findAndCountAll({
                where: whereTarget,
                limit,
                offset,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                include: [{ model: produit_category_model_1.default, as: "category" }],
            });
        };
        this.produitModel = produit_model_1.default;
        this.produitCategory = produit_category_model_1.default;
        this.produitSubCategory = produit_subcategory_model_1.default;
    }
}
exports.default = ProduitService;
