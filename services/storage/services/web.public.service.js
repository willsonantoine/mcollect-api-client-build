"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const site_containt_category_model_1 = __importDefault(require("../../../shared/models/site.containt.category.model"));
const site_containt_model_1 = __importStar(require("../../../shared/models/site.containt.model"));
const site_mode_1 = __importDefault(require("../../../shared/models/site.mode"));
const site_visite_model_1 = __importDefault(require("../../../shared/models/site.visite.model"));
const vars_1 = require("../../../shared/utils/vars");
const produit_model_1 = __importDefault(require("../../../shared/models/produit.model"));
const produit_category_model_copy_1 = __importDefault(require("../../../shared/models/produit.category.model copy"));
const produit_subcategory_model_1 = __importDefault(require("../../../shared/models/produit.subcategory.model"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
const site_members_model_1 = __importDefault(require("../../../shared/models/site.members.model"));
const members_category_model_1 = __importDefault(require("../../../shared/models/members.category.model"));
class WebPublicService {
    constructor() {
        this.getSiteInfos = async ({ token }) => {
            return this.siteModel.findOne({ where: { token } });
        };
        this.getBlogs = async ({ token, categoryId, limit, offset, }) => {
            const whereTarget = {
                type: site_containt_model_1.SiteContaintType.BLOG,
                status: site_containt_model_1.SiteContaintStatus.PUBLISH,
            };
            if (categoryId) {
                whereTarget.categoryId = categoryId;
            }
            return await this.siteContaint.findAndCountAll({
                where: whereTarget,
                limit,
                offset,
                order: [
                    ["favorit", "desc"],
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                include: [
                    { model: site_mode_1.default, as: "site", where: { token }, attributes: [] },
                    { model: site_containt_category_model_1.default, as: "category" },
                ],
            });
        };
        this.getBlogsByUrl = async ({ token, url, }) => {
            const whereTarget = {
                url,
                type: site_containt_model_1.SiteContaintType.BLOG,
                status: site_containt_model_1.SiteContaintStatus.PUBLISH,
            };
            const blog = await this.siteContaint.findOne({
                where: whereTarget,
                order: [
                    ["favorit", "desc"],
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                include: [
                    { model: site_mode_1.default, as: "site", where: { token }, attributes: [] },
                    { model: site_containt_category_model_1.default, as: "category" },
                ],
            });
            const favoritBlogs = await this.siteContaint.findAndCountAll({
                where: { categoryId: blog === null || blog === void 0 ? void 0 : blog.categoryId },
                order: [
                    ["favorit", "desc"],
                    ["createdAt", "desc"],
                ],
                limit: 5,
                offset: 0,
                include: [
                    { model: site_mode_1.default, as: "site", where: { token }, attributes: [] },
                    { model: site_containt_category_model_1.default, as: "category" },
                ],
            });
            return {
                blog,
                favoritBlogs,
            };
        };
        this.getBlocs = async ({ token }) => {
            return await this.siteContaint.findAndCountAll({
                where: {
                    type: site_containt_model_1.SiteContaintType.TEXT,
                },
                order: [
                    ["favorit", "desc"],
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                include: [
                    { model: site_mode_1.default, as: "site", where: { token }, attributes: [] },
                ],
            });
        };
        this.getCategories = async ({ token }) => {
            return await this.siteContaintCategory.findAndCountAll({
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                include: [
                    { model: site_mode_1.default, as: "site", where: { token }, attributes: [] },
                ],
            });
        };
        this.createVisite = async ({ ip, siteId, userAgent, }) => {
            const findIp = await this.siteVisite.findOne({
                where: {
                    ip,
                    createdAt: (0, sequelize_1.literal)(`DATE(SiteVisiteModel.createdAt) = CURRENT_DATE`),
                },
            });
            if (findIp) {
                await this.siteVisite.increment("countVisite", {
                    where: { id: findIp.id },
                });
            }
            else {
                const devise = (0, vars_1.getDeviceType)(userAgent);
                const browser = (0, vars_1.getBrowser)(userAgent);
                await this.siteVisite.create({ ip, browser, devise, siteId });
            }
        };
        this.getProduct = async ({ token, search, subCategoryId, categoryId, }) => {
            const whereProduct = { showOnWeb: true };
            if (subCategoryId) {
                whereProduct.subCategoryId = subCategoryId;
            }
            if (search) {
                whereProduct[sequelize_1.Op.or] = [
                    { id: { [sequelize_1.Op.like]: `%${search}%` } },
                    { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            const whereCateg = {};
            if (subCategoryId) {
                whereCateg.categoryId = categoryId;
            }
            return await this.produitsModel.findAndCountAll({
                where: whereProduct,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                attributes: [
                    "id",
                    "name",
                    "description",
                    "images",
                    "brand",
                    "type",
                    "stockLocation",
                    "url",
                    "unite",
                    "reference",
                    "price_max",
                    "currencyId",
                    "type",
                    "subCategoryId",
                    "createdAt",
                    "updatedAt",
                    "price_min",
                    "createdAt",
                ],
                include: [
                    {
                        model: produit_subcategory_model_1.default,
                        as: "subCategory",
                        where: whereCateg,
                        attributes: ["id", "name", "description", "image"],
                        include: [
                            {
                                model: produit_category_model_copy_1.default,
                                as: "category",
                                attributes: ["id", "name", "description", "image"],
                            },
                        ],
                    },
                    {
                        model: currency_model_1.default,
                        as: "currency",
                        attributes: ["id", "name"],
                    },
                    {
                        model: site_mode_1.default,
                        as: "site",
                        where: { token },
                        attributes: [],
                    },
                ],
            });
        };
        this.getProductCategorie = async ({ token }) => {
            // On récupère tous les produits visibles sur le web et appartenant au site
            const produits = await this.produitsModel.findAll({
                where: {
                    showOnWeb: true,
                },
                attributes: ["id", "subCategoryId"],
                include: [
                    {
                        model: site_mode_1.default,
                        as: "site",
                        where: { token },
                        attributes: [],
                    },
                ],
            });
            // On extrait les IDs des sous-catégories utilisées
            const subCategoryIds = [
                ...new Set(produits.map((p) => p.subCategoryId)),
            ];
            // On récupère maintenant les sous-catégories et leurs catégories parentes
            const subCategories = await produit_subcategory_model_1.default.findAll({
                where: {
                    id: subCategoryIds,
                },
                attributes: ["id", "name", "description", "image", "categoryId"],
                include: [
                    {
                        model: produit_category_model_copy_1.default,
                        as: "category",
                        attributes: ["id", "name", "description", "image"],
                    },
                ],
            });
            // On structure les données pour grouper par catégorie
            const categoriesMap = {};
            for (const sub of subCategories) {
                const category = sub.category;
                if (!categoriesMap[category.id]) {
                    categoriesMap[category.id] = {
                        id: category.id,
                        name: category.name,
                        description: category.description,
                        image: category.image,
                        subCategories: [],
                    };
                }
                categoriesMap[category.id].subCategories.push({
                    id: sub.id,
                    name: sub.name,
                    description: sub.description,
                    image: sub.image,
                });
            }
            // On retourne un tableau des catégories avec leurs sous-catégories
            return Object.values(categoriesMap);
        };
        this.getMembers = async (token) => {
            return await this.siteMember.findAndCountAll({
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                attributes: ["id", "statusAt", "updatedAt"],
                include: [
                    { model: site_mode_1.default, as: "site", where: { token }, attributes: [] },
                    {
                        model: members_model_1.default,
                        as: "member",
                        attributes: ["fullname", "img", "number", "adress"],
                        include: [
                            {
                                model: members_category_model_1.default,
                                as: "fonction",
                                attributes: ["name", "description"],
                            },
                        ],
                    },
                ],
            });
        };
        this.siteModel = site_mode_1.default;
        this.siteContaint = site_containt_model_1.default;
        this.siteContaintCategory = site_containt_category_model_1.default;
        this.siteSubscriber = members_model_1.default;
        this.siteVisite = site_visite_model_1.default;
        this.produitsModel = produit_model_1.default;
        this.categoryModel = produit_category_model_copy_1.default;
        this.subCategoryModel = produit_subcategory_model_1.default;
        this.siteMember = site_members_model_1.default;
    }
}
exports.default = WebPublicService;
