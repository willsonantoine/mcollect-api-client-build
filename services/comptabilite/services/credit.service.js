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
const members_category_model_1 = __importDefault(require("../../../shared/models/members.category.model"));
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
            const result = await this.creditModel.findOne({
                attributes: [[(0, sequelize_1.fn)("COALESCE", (0, sequelize_1.fn)("MAX", (0, sequelize_1.col)("id")), 0), "maxId"]],
                paranoid: false,
            });
            // Récupère la valeur de maxId retournée par la requête
            const maxId = (result === null || result === void 0 ? void 0 : result.get("maxId")) || 0;
            // Retourne maxId + 1
            return maxId + 1;
        };
        this.payerCredit = async ({ id, amount, userCreateId, operationId, }) => {
            const credit = await this.creditModel.findByPk(id);
            if (credit) {
                const reste = (credit.remaining || 0) - amount;
                const type = reste <= 0 ? "Terminé" : credit.creditType;
                await this.creditModel.update({ remaining: reste, creditType: type }, { where: { id }, returning: true });
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
                                include: [
                                    {
                                        model: members_category_model_1.default,
                                        as: "fonction",
                                        attributes: ["id", "name"],
                                    },
                                ],
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
        this.getAllGuarantees = async ({ month, year, date2, date1, gender, }) => {
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
                    attributes: ["guarantees", [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("motif")), "count"]],
                    group: ["guarantees"],
                    raw: true,
                    order: [[(0, sequelize_1.literal)("guarantees"), "asc"]],
                });
                return result.map((item) => ({
                    reason: item.guarantees,
                    count: Number(item.count),
                }));
            }
            catch (error) {
                console.error("Error fetching reasons with count:", error);
                return [];
            }
        };
        // Assuming this is within a service class that has this.creditModel initialized
        this.getTotalByTypeAndCurrency = async ({ guarantees, reason, date2, date1, currencyId, memberId, // This parameter isn't currently used in the where clauses
        year, month, gender, }) => {
            try {
                // Base Where clause for CreditModel
                const whereCredit = {
                    deletedAt: null, // Assuming soft delete
                };
                // Date range filter on CreditModel's creation date (or relevant date field)
                // Make sure 'createAt' is the correct column name on CreditModel
                if (date1 && date2) {
                    whereCredit.createdAt = {
                        // Adjust 'createdAt' if your column name is different
                        [sequelize_1.Op.gte]: date1,
                        [sequelize_1.Op.lte]: date2,
                    };
                }
                if (guarantees) {
                    // Ensure 'garentis' is the correct column name on CreditModel
                    whereCredit.garentis = guarantees;
                }
                if (reason) {
                    // Ensure 'reason' is the correct column name on CreditModel
                    whereCredit.reason = reason;
                }
                // Year/Month filter on CreditModel's start date (or relevant date field)
                // Ensure 'date_debut' is the correct column name on CreditModel
                const dateAddConditions = [];
                if (year) {
                    dateAddConditions.push((0, sequelize_1.literal)(`YEAR(date_debut) = ${parseInt(year.toString(), 10)}`)); // Ensure year is integer
                }
                if (month) {
                    dateAddConditions.push((0, sequelize_1.literal)(`MONTH(date_debut) = ${parseInt(month.toString(), 10)}`)); // Ensure month is integer
                }
                if (dateAddConditions.length > 0) {
                    whereCredit.date_debut = {
                        // Apply to the correct date column
                        [sequelize_1.Op.and]: dateAddConditions,
                    };
                }
                // Where clause for MembersModel association
                const whereMembers = {};
                if (gender) {
                    whereMembers.gender = gender;
                }
                // Where clause for CurrencyModel association
                const whereCurrency = {};
                if (currencyId) {
                    whereCurrency.id = currencyId;
                }
                const result = await this.creditModel.findAll({
                    attributes: [
                        // Non-aggregated columns (must be in GROUP BY)
                        "type_credit", // From CreditModel directly
                        [(0, sequelize_1.col)("operation->currency.id"), "currencyId"], // Explicitly select for mapping & grouping
                        [(0, sequelize_1.col)("operation->currency.designation"), "currencyName"], // Explicitly select for mapping & grouping
                        // Aggregated columns
                        [
                            (0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("CreditModel.montant_demande")),
                            "totalRequestedAmount",
                        ], // Ensure column name is correct
                        [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("CreditModel.reste")), "totalRemaining"], // Ensure column name is correct
                    ],
                    include: [
                        {
                            model: operations_model_2.default,
                            as: "operation", // ***Crucial: Ensure this alias matches your CreditModel association***
                            attributes: [], // Not selecting directly from Operation, just using for joins/filters
                            required: true, // INNER JOIN to Operation
                            include: [
                                {
                                    model: currency_model_1.default,
                                    as: "currency", // ***Crucial: Ensure this alias matches your OperationModel association***
                                    attributes: [], // Attributes selected above
                                    where: whereCurrency, // Apply currency filter here
                                    required: true, // INNER JOIN to Currency (or set based on currencyId presence)
                                },
                                {
                                    model: members_model_1.default,
                                    as: "beneficiaire", // ***Crucial: Ensure this alias matches your OperationModel association***
                                    attributes: [],
                                    where: whereMembers, // Apply member filter here
                                    required: !!gender, // Make INNER JOIN only if filtering by gender, otherwise LEFT JOIN
                                },
                            ],
                        },
                    ],
                    where: whereCredit, // Apply CreditModel filters
                    group: [
                        "type_credit", // Group by column from CreditModel
                        (0, sequelize_1.col)("operation->currency.id"), // Group by associated currency ID
                        (0, sequelize_1.col)("operation->currency.designation"), // <-- ADDED: Group by associated currency name
                    ],
                    order: [
                        // Ordering might need adjustment depending on desired output
                        // Ordering by an aggregated value might be more meaningful, e.g.:
                        // [Sequelize.literal('totalRequestedAmount'), 'DESC']
                        ["type_credit", "ASC"], // Keep original order for now
                    ],
                    raw: true, // Get plain objects
                });
                // Map the raw results to the desired ICreditSummary structure
                // Access properties using the aliases defined in 'attributes'
                return result.map((item) => ({
                    creditType: item.type_credit,
                    currencyId: item.currencyId, // Use the alias
                    currencyName: item.currencyName, // Use the alias
                    totalRequestedAmount: Number(item.totalRequestedAmount) || 0, // Add fallback for safety
                    totalRemaining: Number(item.totalRemaining) || 0, // Add fallback for safety
                }));
            }
            catch (error) {
                // Log the detailed error for debugging
                console.error("Error fetching credit summary:", error);
                // Consider throwing the error or returning a more specific error response
                // depending on how the calling code handles errors.
                return []; // Return empty array on error as per original code
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
        this.updateCreditType = async ({ type, id, userId, observation, reste_a_payer, startDate, endDate, reason, }) => {
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
                    reason,
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
