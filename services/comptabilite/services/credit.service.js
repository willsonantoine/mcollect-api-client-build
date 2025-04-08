"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const credits_model_1 = __importDefault(require("../../../shared/models/credits.model"));
const sequelize_1 = require("sequelize");
const operations_model_1 = __importDefault(require("../../../shared/models/operations.model"));
const operations_model_2 = __importDefault(require("../../../shared/models/operations.model"));
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const compte_model_1 = __importDefault(require("../../../shared/models/compte.model"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
const credits_penality_model_1 = __importDefault(require("../../../shared/models/credits.penality.model"));
const vars_1 = require("../../../shared/utils/vars");
const operations_service_1 = __importDefault(require("./operations.service"));
class CreditService {
    constructor() {
        this.createCredit = async (data) => {
            return await this.creditModel.create(data);
        };
        this.deleteCredit = async (id, userDeletedId, deletedReason) => {
            const update = await this.creditModel.update({ userDeleted: userDeletedId, deletedReason }, { where: { id }, returning: true });
            await this.creditModel.destroy({ where: { id } });
        };
        this.getNextNumber = async () => {
            const nextNumber = await this.creditModel.count({ paranoid: false });
            return nextNumber + 1;
        };
        this.payerCredit = async ({ id, amount, userCreateId, operationId, }) => {
            const credit = await this.creditModel.findByPk(id);
            if (credit) {
                await this.creditModel.update({ remaining: (credit.remaining || 0) - amount }, { where: { id }, returning: true });
                const operationSerrviec = new operations_service_1.default();
                const result = await operationSerrviec.validateOperation(operationId, userCreateId);
                if (result) {
                    console.log(`Crédit remboursé avec success `);
                }
            }
        };
        this.getCredits = async ({ guarantees, reason, type, limit, offset, search, date2, date1, currencyId, memberId, year, month, gender, }) => {
            const whereOperations = {};
            const whereMember = {};
            const whereTarget = date1 && date2
                ? {
                    createdAt: {
                        [sequelize_1.Op.and]: [
                            (0, sequelize_1.literal)(`DATE(CreditModel.createAt) >= '${date1}'`),
                            (0, sequelize_1.literal)(`DATE(CreditModel.createAt) <= '${date2}'`),
                        ],
                    },
                }
                : {};
            if (currencyId) {
                whereOperations.currencyId = currencyId;
            }
            if (memberId) {
                whereOperations.memberId = memberId;
            }
            if (guarantees) {
                whereTarget.guarantees = guarantees;
            }
            if (reason) {
                whereTarget.reason = reason;
            }
            if (type) {
                whereTarget.creditType = type;
            }
            if (search) {
                whereMember[sequelize_1.Op.or] = [
                    { fullname: { [sequelize_1.Op.like]: `%${search}%` } },
                    { phone: { [sequelize_1.Op.like]: `%${search}%` } },
                    { mail: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            if (gender) {
                whereMember.gender = gender;
            }
            if (year) {
                whereOperations[sequelize_1.Op.and] = [
                    ...(whereOperations[sequelize_1.Op.and] || []),
                    (0, sequelize_1.where)((0, sequelize_1.fn)("YEAR", (0, sequelize_1.col)("date_debut")), year),
                ];
            }
            if (month) {
                whereOperations[sequelize_1.Op.and] = [
                    ...(whereOperations[sequelize_1.Op.and] || []),
                    (0, sequelize_1.where)((0, sequelize_1.fn)("MONTH", (0, sequelize_1.col)("date_debut")), month),
                ];
            }
            return await this.creditModel.findAndCountAll({
                where: whereTarget,
                offset,
                limit,
                order: [["createdAt", "desc"]],
                attributes: [
                    "id",
                    "number",
                    "month",
                    "rate",
                    "createdAt",
                    "updatedAt",
                    "guarantees",
                    "reason",
                    "startDate",
                    "endDate",
                    "remaining",
                    "creditType",
                    "amountInWords",
                    "requestedAmount",
                    "interestAmount",
                    "addedDate",
                    "updateObservation",
                ],
                include: [
                    {
                        model: operations_model_1.default,
                        as: "operation",
                        where: whereOperations,
                        attributes: ["id", "amount", "succursaleId"],
                        include: [
                            {
                                model: members_model_1.default,
                                as: "beneficiaire",
                                attributes: [
                                    "id",
                                    "fullname",
                                    "img",
                                    "gender",
                                    "phone",
                                    "adress",
                                    "type",
                                    "status_civil",
                                    "joinedAt",
                                ],
                                where: whereMember,
                            },
                            {
                                model: currency_model_1.default,
                                as: "currency",
                                attributes: ["id", "name"],
                            },
                            {
                                model: compte_model_1.default,
                                as: "compteFrom",
                                attributes: ["id", "name", "number"],
                            },
                            {
                                model: compte_model_1.default,
                                as: "compteTo",
                                attributes: ["id", "name", "number"],
                            },
                        ],
                    },
                ],
            });
        };
        this.getCountCreditByYears = async () => {
            try {
                const result = await this.creditModel.findAll({
                    attributes: [
                        [(0, sequelize_1.fn)("YEAR", (0, sequelize_1.col)("date_debut")), "year"], // Extract the year
                        [(0, sequelize_1.fn)("COUNT", "*"), "count"], // Count the credits
                    ],
                    group: [(0, sequelize_1.fn)("YEAR", (0, sequelize_1.col)("date_debut"))], // Group by year
                    raw: true, // Return raw objects
                    order: [[(0, sequelize_1.fn)("YEAR", (0, sequelize_1.col)("date_debut")), "ASC"]], // Order by year
                });
                // Type assertion to map to the desired result type
                return result.map((item) => ({
                    year: Number(item.year), // Convert year to number
                    count: Number(item.count), // Convert count to number
                }));
            }
            catch (error) {
                console.error("Error fetching credit count by years:", error);
                return []; // Return an empty array in case of an error
            }
        };
        this.getAllReason = async ({ month, year, date2, date1, gender, }) => {
            try {
                const whereTarget = date1 && date2
                    ? {
                        createdAt: {
                            [sequelize_1.Op.and]: [
                                (0, sequelize_1.literal)(`DATE(CreditModel.createAt) >= '${date1}'`),
                                (0, sequelize_1.literal)(`DATE(CreditModel.createAt) <= '${date2}'`),
                            ],
                        },
                    }
                    : {};
                if (year) {
                    whereTarget[sequelize_1.Op.and] = [
                        ...(whereTarget[sequelize_1.Op.and] || []),
                        (0, sequelize_1.where)((0, sequelize_1.fn)("YEAR", (0, sequelize_1.col)("date_debut")), year),
                    ];
                }
                if (month) {
                    whereTarget[sequelize_1.Op.and] = [
                        ...(whereTarget[sequelize_1.Op.and] || []),
                        (0, sequelize_1.where)((0, sequelize_1.fn)("MONTH", (0, sequelize_1.col)("date_debut")), month),
                    ];
                }
                const result = await this.creditModel.findAll({
                    where: whereTarget,
                    attributes: ["motif", [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("motif")), "count"]],
                    group: ["motif"],
                    raw: true,
                    order: [[(0, sequelize_1.literal)("motif"), "asc"]],
                });
                return result.map((item) => ({
                    reason: item.motif,
                    count: Number(item.count),
                }));
            }
            catch (error) {
                console.error("Error fetching reasons with count:", error);
                return [];
            }
        };
        this.getTotalByTypeAndCurrency = async ({ guarantees, reason, date2, date1, currencyId, memberId, year, month, gender, }) => {
            try {
                const where = {
                    deletedAt: null,
                };
                if (date1 && date2) {
                    where.createAt = {
                        [sequelize_1.Op.gte]: date1,
                        [sequelize_1.Op.lte]: date2,
                    };
                }
                if (guarantees) {
                    where.garentis = guarantees;
                }
                if (reason) {
                    where.reason = reason;
                }
                if (year) {
                    where.dateAdd = {
                        [sequelize_1.Op.and]: [(0, sequelize_1.literal)(`YEAR(date_debut) = ${year}`)],
                    };
                }
                if (month) {
                    if (where.dateAdd && where.dateAdd[sequelize_1.Op.and]) {
                        where.dateAdd[sequelize_1.Op.and].push((0, sequelize_1.literal)(`MONTH(date_debut) = ${month}`));
                    }
                    else {
                        where.dateAdd = {
                            [sequelize_1.Op.and]: [(0, sequelize_1.literal)(`MONTH(date_debut) = ${month}`)],
                        };
                    }
                }
                const whereMembers = {};
                if (gender) {
                    whereMembers.gender = gender;
                }
                const result = await this.creditModel.findAll({
                    attributes: [
                        "type_credit",
                        [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("montant_demande")), "totalRequestedAmount"],
                        [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("CreditModel.reste")), "totalRemaining"],
                    ],
                    include: [
                        {
                            model: operations_model_2.default,
                            attributes: [],
                            required: true,
                            include: [
                                {
                                    model: currency_model_1.default,
                                    attributes: ["id", "name"],
                                    required: true,
                                    where: currencyId ? { id: currencyId } : {}, // Conditional currency filter
                                    as: "currency", // Important: Keep the alias consistent
                                },
                                {
                                    model: members_model_1.default,
                                    as: "beneficiaire",
                                    where: whereMembers,
                                    attributes: [],
                                },
                            ],
                            as: "operation", // Alias for the association, use the same as defined in your association
                        },
                    ],
                    where,
                    group: ["type_credit", "operation.currency.id"], // Group by credit type and currency ID
                    order: ["type_credit"],
                    raw: true,
                });
                return result.map((item) => ({
                    creditType: item.type_credit,
                    currencyId: item["operation.currency.id"], // Access nested property using dot notation with raw: true
                    currencyName: item["operation.currency.name"],
                    totalRequestedAmount: Number(item.totalRequestedAmount),
                    totalRemaining: Number(item.totalRemaining),
                }));
            }
            catch (error) {
                console.error("Error executing Sequelize query:", error);
                return [];
            }
        };
        this.getPenalitiesPercentage = async (days) => {
            return this.creditPenality.findOne({
                where: {
                    dayMin: {
                        [sequelize_1.Op.lte]: days, // dayMin <= days
                    },
                    dayMax: {
                        [sequelize_1.Op.gte]: days, // dayMax >= days
                    },
                },
            });
        };
        this.updateCreditType = async ({ type, id, userId, observation, reste_a_payer, startDate, endDate, }) => {
            const findCredit = await this.creditModel.findByPk(id);
            if (findCredit) {
                const observation_ = `Le ${(0, vars_1.getDateTimeFull)()} = ${observation}. ::: ${findCredit.updateObservation || ""}`;
                console.log(observation);
                return await this.creditModel.update({
                    userUpdated: userId,
                    updateObservation: observation_,
                    creditType: type,
                    remaining: reste_a_payer,
                    startDate,
                    endDate: endDate,
                }, {
                    where: { id },
                    returning: true,
                });
            }
            return null;
        };
        this.creditModel = credits_model_1.default;
        this.creditPenality = credits_penality_model_1.default;
    }
    async getCreditsByMonth({ year, currencyId }) {
        try {
            const whereOperations = {}; // Where clause for OperationsModel
            if (currencyId) {
                whereOperations.currencyId = currencyId;
            }
            const result = await credits_model_1.default.findAll({
                attributes: [
                    [(0, sequelize_1.fn)("MONTH", (0, sequelize_1.col)("date_debut")), "month"], // Extract the month
                    [(0, sequelize_1.fn)("COUNT", "*"), "count"], // Count the credits
                ],
                include: [
                    {
                        model: operations_model_1.default,
                        as: "operation", // Important: use the correct alias
                        where: whereOperations,
                        required: true, // Use required: true for INNER JOIN
                        attributes: [], // Exclude OperationsModel attributes from the result
                    },
                ],
                where: {
                    [sequelize_1.Op.and]: [
                        year ? (0, sequelize_1.literal)(`YEAR(date_debut) = ${year}`) : {}, // Use year only if it is provided
                    ],
                },
                group: [(0, sequelize_1.fn)("MONTH", (0, sequelize_1.col)("date_debut"))], // Group by month
                raw: true, // Return raw objects
                order: [[(0, sequelize_1.fn)("MONTH", (0, sequelize_1.col)("date_debut")), "ASC"]], // Order by month
            });
            // Type assertion and mapping to the desired result type
            return result.map((item) => ({
                month: Number(item.month), // Convert month to number
                count: Number(item.count), // Convert count to number
            }));
        }
        catch (error) {
            console.error("Error fetching credit count by month:", error);
            return []; // Return an empty array in case of an error
        }
    }
}
exports.default = CreditService;
