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
const site_containt_model_1 = __importStar(require("../../../shared/models/site.containt.model"));
const site_mode_1 = __importDefault(require("../../../shared/models/site.mode"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
const site_containt_category_model_1 = __importDefault(require("../../../shared/models/site.containt.category.model"));
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const site_visite_model_1 = __importDefault(require("../../../shared/models/site.visite.model"));
class WebService {
    constructor() {
        // The SiteDashboard function (as defined in the previous response)
        this.SiteDashboard = async ({ currentYear, type, }) => {
            // ... (The implementation from the previous response goes here) ...
            const now = new Date();
            let startDate;
            let endDate;
            // Determine the start and end dates based on the 'type'
            switch (type) {
                case "year":
                    startDate = new Date(currentYear, 0, 1); // January 1st of currentYear
                    endDate = new Date(currentYear + 1, 0, 1); // January 1st of next year (exclusive)
                    break;
                case "month":
                    const currentMonth = now.getMonth(); // 0-indexed
                    startDate = new Date(currentYear, currentMonth, 1); // 1st of the current month
                    endDate = new Date(currentYear, currentMonth + 1, 1); // 1st of the next month (exclusive)
                    break;
                case "week":
                    const dayOfWeek = now.getDay(); // 0 (Sunday) - 6 (Saturday)
                    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when day is sunday
                    startDate = new Date(now.setDate(diff));
                    startDate.setHours(0, 0, 0, 0); // Set to start of the week
                    endDate = new Date(now.setDate(diff + 7));
                    endDate.setHours(0, 0, 0, 0); // Set to start of next week
                    break;
                default:
                    throw new Error(`Invalid type: ${type}`);
            }
            // Helper function to calculate counts with date filtering and previous year comparison
            const calculateCounts = async (model, // Replace 'any' with the actual type of your model
            dateField = null, // Field to filter counts on. e.g. 'createdAt'
            whereClause = {}) => {
                let currentPeriodWhereClause = Object.assign({}, whereClause); // Copy the base clause
                let previousYearWhereClause = Object.assign({}, whereClause);
                if (dateField) {
                    currentPeriodWhereClause[dateField] = {
                        [sequelize_1.Op.gte]: startDate,
                        [sequelize_1.Op.lt]: endDate,
                    };
                    const previousStartDate = new Date(startDate);
                    previousStartDate.setFullYear(currentYear - 1);
                    const previousEndDate = new Date(endDate);
                    previousEndDate.setFullYear(currentYear - 1);
                    previousYearWhereClause[dateField] = {
                        [sequelize_1.Op.gte]: previousStartDate,
                        [sequelize_1.Op.lt]: previousEndDate,
                    };
                }
                const currentCount = await model.count({
                    where: currentPeriodWhereClause,
                });
                const previousCount = await model.count({
                    where: previousYearWhereClause,
                });
                let progression = 0;
                if (previousCount > 0) {
                    progression = ((currentCount - previousCount) / previousCount) * 100;
                }
                else if (currentCount > 0) {
                    progression = 100; // If previous was 0, and current is > 0, then 100% growth.
                }
                return {
                    current: currentCount,
                    previous: previousCount,
                    progression: progression,
                };
            };
            // Calculate counts for each metric
            const sites = await calculateCounts(this.siteModel, "createdAt");
            const blogs = await calculateCounts(this.siteContaint, "createdAt", {
                type: site_containt_model_1.SiteContaintType.BLOG,
            }); // Use enum
            const visites = await calculateCounts(this.siteVisite, "createdAt");
            const subscribers = await calculateCounts(this.siteSubscriber, "createdAt");
            const containtCategories = await calculateCounts(this.siteContaintCategory, "createdAt");
            // Build time series data for visites
            let visitesTimeSeries = [];
            if (type === "year") {
                const months = Array.from({ length: 12 }, (_, i) => i); // [0, 1, ..., 11]
                visitesTimeSeries = await Promise.all(months.map(async (month) => {
                    const monthStart = new Date(currentYear, month, 1);
                    const monthEnd = new Date(currentYear, month + 1, 1);
                    const count = await this.siteVisite.count({
                        where: {
                            createdAt: { [sequelize_1.Op.gte]: monthStart, [sequelize_1.Op.lt]: monthEnd },
                        },
                    });
                    return {
                        label: monthStart.toLocaleString("default", { month: "short" }),
                        value: count,
                    };
                }));
            }
            else if (type === "month") {
                const month = now.getMonth();
                const year = now.getFullYear();
                const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get last day of the month
                visitesTimeSeries = await Promise.all(Array.from({ length: daysInMonth }, (_, i) => i + 1).map(async (day) => {
                    const dayStart = new Date(year, month, day, 0, 0, 0);
                    const dayEnd = new Date(year, month, day + 1, 0, 0, 0);
                    const count = await this.siteVisite.count({
                        where: {
                            createdAt: { [sequelize_1.Op.gte]: dayStart, [sequelize_1.Op.lt]: dayEnd },
                        },
                    });
                    return { label: String(day).padStart(2, "0"), value: count };
                }));
            }
            else if (type === "week") {
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                visitesTimeSeries = await Promise.all(days.map(async (dayLabel, index) => {
                    const dayStart = new Date(startDate);
                    dayStart.setDate(startDate.getDate() + index);
                    dayStart.setHours(0, 0, 0, 0);
                    const dayEnd = new Date(startDate);
                    dayEnd.setDate(startDate.getDate() + index + 1);
                    dayEnd.setHours(0, 0, 0, 0);
                    const count = await this.siteVisite.count({
                        where: {
                            createdAt: { [sequelize_1.Op.gte]: dayStart, [sequelize_1.Op.lt]: dayEnd },
                        },
                    });
                    return { label: dayLabel, value: count };
                }));
            }
            return {
                sites,
                blogs,
                visites,
                subscribers,
                containtCategories,
                visitesTimeSeries,
            };
        };
        this.SiteFindAll = ({ limit, offset, }) => {
            return this.siteModel.findAndCountAll({
                limit,
                offset,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                include: [
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
                ],
            });
        };
        this.SiteFindOne = (id) => {
            return this.siteModel.findByPk(id);
        };
        this.SiteFindByName = (name) => {
            return this.siteModel.findOne({ where: { name } });
        };
        this.SiteCreate = async (data) => {
            return await this.siteModel.create(data);
        };
        this.SiteDelete = async (id) => {
            return await this.siteModel.destroy({ where: { id } });
        };
        this.SiteUpdate = async (id, data) => {
            return await this.siteModel.update(data, { where: { id } });
        };
        // Site containt
        this.SiteContaintCreate = async (data) => {
            return await this.siteContaint.create(data);
        };
        this.SiteContaintUpdate = async (id, data) => {
            return await this.siteContaint.update(data, { where: { id } });
        };
        this.SiteContaintDelete = async (id) => {
            return await this.siteContaint.destroy({ where: { id } });
        };
        this.SiteContaintFindAll = async ({ type, limit, offset, siteId, search, }) => {
            const whereTarget = { type };
            if (siteId) {
                whereTarget.siteId = siteId;
            }
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { title: { [sequelize_1.Op.like]: `%${search}%` } },
                    { metaTags: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            return await this.siteContaint.findAndCountAll({
                where: whereTarget,
                offset,
                limit,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                include: [
                    { model: users_model_1.default, as: 'userUpdated', attributes: ['id', 'username', 'avatar'] },
                    { model: users_model_1.default, as: 'userCreated', attributes: ['id', 'username', 'avatar'] },
                    { model: site_containt_category_model_1.default, as: 'category', attributes: ['id', 'name'] },
                ]
            });
        };
        this.SiteContaintFindOne = async ({ id }) => {
            return await this.siteContaint.findByPk(id);
        };
        this.SiteContaintFindTitle = async ({ title, type }) => {
            console.log(title);
            return await this.siteContaint.findOne({ where: { title, type } });
        };
        this.SiteContaintCategoryCreate = async (data) => {
            return await this.siteContaintCategory.create(data);
        };
        this.SiteContaintCategoryUpdate = async (id, data) => {
            return await this.siteContaintCategory.update(data, { where: { id } });
        };
        this.SiteContaintCategoryDelete = async (id) => {
            return await this.siteContaintCategory.destroy({ where: { id } });
        };
        this.SiteContaintCategoryFindOne = async (id) => {
            return await this.siteContaintCategory.findOne({ where: { id } });
        };
        this.SiteContaintCategoryFindByName = async (name) => {
            return await this.siteContaintCategory.findOne({ where: { name } });
        };
        this.SiteContaintCategoryFindAll = async ({ limit, search, offset, siteId, }) => {
            const whereTarget = {};
            if (siteId) {
                whereTarget.siteId = siteId;
            }
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    { description: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            return await this.siteContaintCategory.findAndCountAll({
                where: whereTarget,
                limit,
                offset,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "asc"],
                ],
            });
        };
        this.getVisites = async ({ siteId }) => {
            return await this.siteVisite.findAndCountAll({
                where: { siteId },
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
            });
        };
        this.siteModel = site_mode_1.default;
        this.siteContaint = site_containt_model_1.default;
        this.siteContaintCategory = site_containt_category_model_1.default;
        this.siteSubscriber = members_model_1.default;
        this.siteVisite = site_visite_model_1.default;
    }
}
exports.default = WebService;
