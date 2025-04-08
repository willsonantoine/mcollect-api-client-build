"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const operations_model_1 = __importDefault(require("../../../shared/models/operations.model"));
const compte_model_1 = __importDefault(require("../../../shared/models/compte.model"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
const moment_1 = __importDefault(require("moment"));
const credits_model_1 = __importDefault(require("../../../shared/models/credits.model"));
const messages_1 = __importDefault(require("../../../shared/models/messages"));
const produit_model_1 = __importDefault(require("../../../shared/models/produit.model"));
class DashboardService {
    constructor() {
        this.membersModel = members_model_1.default;
        this.operationsModel = operations_model_1.default;
        this.accountModel = compte_model_1.default;
        this.userModel = users_model_1.default;
        this.creditModel = credits_model_1.default;
        this.messageModel = messages_1.default;
        this.productModel = produit_model_1.default;
    }
    async getDashInfo(filterId) {
        const now = (0, moment_1.default)();
        let startDate = null;
        let endDate = now.clone();
        switch (filterId) {
            case "week":
                startDate = now.clone().startOf("week");
                break;
            case "month":
                startDate = now.clone().startOf("month");
                break;
            case "year":
                startDate = now.clone().startOf("year");
                break;
            case "all":
                startDate = null;
                break;
            default:
                throw new Error(`Invalid filterId: ${filterId}`);
        }
        const whereClause = startDate
            ? {
                createdAt: {
                    [sequelize_1.Op.gte]: startDate.toDate(),
                    [sequelize_1.Op.lte]: endDate.toDate(),
                },
            }
            : {};
        const lastMonthWhereClause = startDate
            ? {
                createdAt: {
                    [sequelize_1.Op.gte]: (0, moment_1.default)(startDate)
                        .subtract(1, "month")
                        .startOf("month")
                        .toDate(),
                    [sequelize_1.Op.lte]: (0, moment_1.default)(startDate)
                        .subtract(1, "month")
                        .endOf("month")
                        .toDate(),
                },
            }
            : {};
        const fetchCount = async (model, where) => {
            try {
                const result = await model.count({ where });
                return typeof result === "number"
                    ? result
                    : result && typeof result.count === "number"
                        ? result.count
                        : 0;
            }
            catch (error) {
                console.error(`Error fetching count for ${model.name}:`, error);
                return 0;
            }
        };
        const fetchOperationsByDateCount = async (startDate, endDate, filterId) => {
            try {
                const operations = await this.getOperationsByDate(startDate, endDate, filterId);
                return operations.reduce((sum, op) => sum + op.count, 0);
            }
            catch (error) {
                console.error("Error fetching operations by date:", error);
                return 0;
            }
        };
        const [totalMembers, totalOperations, totalAccounts, totalUsers, totalCredits, totalMessages, totalProduct, monthlyMembers, monthlyOperations, monthlyAccounts, monthlyUsers, monthlyMessages, monthlyCredits, lastMonthMembers, lastMonthOperations, lastMonthAccounts, lastMonthUsers, lastMonthCredits, lastMonthMessages, lastMonthProduct, operationsByDateCount,] = await Promise.all([
            fetchCount(this.membersModel),
            fetchCount(this.operationsModel),
            fetchCount(this.accountModel),
            fetchCount(this.userModel),
            fetchCount(this.creditModel),
            fetchCount(this.messageModel),
            fetchCount(this.productModel),
            fetchCount(this.membersModel, whereClause),
            fetchCount(this.operationsModel, whereClause),
            fetchCount(this.accountModel, whereClause),
            fetchCount(this.userModel, whereClause),
            fetchCount(this.creditModel, whereClause),
            fetchCount(this.messageModel, whereClause),
            fetchCount(this.membersModel, lastMonthWhereClause),
            fetchCount(this.operationsModel, lastMonthWhereClause),
            fetchCount(this.accountModel, lastMonthWhereClause),
            fetchCount(this.userModel, lastMonthWhereClause),
            fetchCount(this.creditModel, lastMonthWhereClause),
            fetchCount(this.messageModel, lastMonthWhereClause),
            fetchCount(this.productModel, lastMonthWhereClause),
            fetchOperationsByDateCount((startDate === null || startDate === void 0 ? void 0 : startDate.toDate()) || null, endDate.toDate(), filterId),
        ]);
        const calculateProgression = (current, previous) => {
            if (previous === 0) {
                return current === 0 ? 0 : 100;
            }
            return ((current - previous) / previous) * 100;
        };
        const operationsByDateList = await this.getOperationsByDate((startDate === null || startDate === void 0 ? void 0 : startDate.toDate()) || null, endDate.toDate(), filterId);
        return {
            totals: {
                members: totalMembers,
                operations: totalOperations,
                accounts: totalAccounts,
                users: totalUsers,
                credits: totalCredits,
                messages: totalMessages,
                produect: totalProduct,
            },
            monthly: {
                members: monthlyMembers,
                operations: monthlyOperations,
                accounts: monthlyAccounts,
                users: monthlyUsers,
                credits: monthlyCredits,
                messages: monthlyMessages,
            },
            progression: {
                members: calculateProgression(monthlyMembers, lastMonthMembers),
                operations: calculateProgression(monthlyOperations, lastMonthOperations),
                accounts: calculateProgression(monthlyAccounts, lastMonthAccounts),
                users: calculateProgression(monthlyUsers, lastMonthUsers),
                credit: calculateProgression(monthlyCredits, lastMonthCredits),
                messages: calculateProgression(monthlyMessages, lastMonthMessages),
            },
            operationsByDate: operationsByDateList,
        };
    }
    async getOperationsByDate(startDate, endDate, filterId) {
        try {
            let labels = [];
            let operations;
            const whereClause = startDate
                ? {
                    date_save: {
                        [sequelize_1.Op.gte]: startDate,
                        [sequelize_1.Op.lte]: endDate,
                    },
                }
                : {};
            if (filterId === "week") {
                labels = [
                    "lundi",
                    "mardi",
                    "mercredi",
                    "jeudi",
                    "vendredi",
                    "samedi",
                    "dimanche",
                ];
                operations = await this.operationsModel.findAll({
                    attributes: [
                        [sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("date_save")), "date"],
                        [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.literal("*")), "count"],
                    ],
                    where: whereClause,
                    group: [sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("date_save"))],
                    raw: true,
                    order: [[sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("date_save")), "ASC"]],
                });
                const operationsMap = {};
                operations.forEach((op) => {
                    const dayOfWeek = (0, moment_1.default)(op.date).isoWeekday();
                    operationsMap[dayOfWeek.toString()] = Number(op.count);
                });
                const result = labels.map((label, index) => {
                    const dayIndex = index + 1;
                    return {
                        date: label,
                        count: operationsMap[dayIndex.toString()] || 0,
                    };
                });
                return result;
            }
            else if (filterId === "month") {
                let currentDate = startDate
                    ? (0, moment_1.default)(startDate)
                    : (0, moment_1.default)().startOf("month");
                let endOfMonth = (0, moment_1.default)(endDate).endOf("month");
                while (currentDate.isSameOrBefore(endOfMonth, "day")) {
                    labels.push(currentDate.format("YYYY-MM-DD"));
                    currentDate.add(1, "day");
                }
                operations = await this.operationsModel.findAll({
                    attributes: [
                        [sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("date_save")), "date"],
                        [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.literal("*")), "count"],
                    ],
                    where: whereClause,
                    group: [sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("date_save"))],
                    raw: true,
                    order: [[sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("date_save")), "ASC"]],
                });
                const operationsMap = {};
                operations.forEach((op) => {
                    operationsMap[(0, moment_1.default)(op.date).format("YYYY-MM-DD")] = Number(op.count);
                });
                return labels.map((label) => ({
                    date: label,
                    count: operationsMap[label] || 0,
                }));
            }
            else if (filterId === "year") {
                labels = moment_1.default.months();
                operations = await this.operationsModel.findAll({
                    attributes: [
                        [sequelize_1.Sequelize.fn("MONTH", sequelize_1.Sequelize.col("date_save")), "month"],
                        [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.literal("*")), "count"],
                    ],
                    where: whereClause,
                    group: [sequelize_1.Sequelize.fn("MONTH", sequelize_1.Sequelize.col("date_save"))],
                    raw: true,
                    order: [[sequelize_1.Sequelize.fn("MONTH", sequelize_1.Sequelize.col("date_save")), "ASC"]],
                });
                const operationsMap = {};
                operations.forEach((op) => {
                    operationsMap[op.month.toString()] = Number(op.count);
                });
                return labels.map((label, index) => {
                    const monthIndex = index + 1;
                    return {
                        date: label,
                        count: operationsMap[monthIndex.toString()] || 0,
                    };
                });
            }
            else if (filterId === "all") {
                operations = await this.operationsModel.findAll({
                    attributes: [
                        [sequelize_1.Sequelize.fn("YEAR", sequelize_1.Sequelize.col("date_save")), "date"],
                        [sequelize_1.Sequelize.fn("COUNT", sequelize_1.Sequelize.literal("*")), "count"],
                    ],
                    group: [sequelize_1.Sequelize.fn("YEAR", sequelize_1.Sequelize.col("date_save"))],
                    raw: true,
                    order: [[sequelize_1.Sequelize.fn("YEAR", sequelize_1.Sequelize.col("date_save")), "ASC"]],
                });
                return operations.map((op) => ({
                    date: op.date,
                    count: Number(op.count),
                }));
            }
            return [];
        }
        catch (error) {
            console.error("Error fetching operations by date:", error);
            return [];
        }
    }
}
exports.default = DashboardService;
