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
        this.siteModel = site_mode_1.default;
        this.siteContaint = site_containt_model_1.default;
        this.siteContaintCategory = site_containt_category_model_1.default;
        this.siteSubscriber = members_model_1.default;
        this.siteVisite = site_visite_model_1.default;
    }
}
exports.default = WebPublicService;
