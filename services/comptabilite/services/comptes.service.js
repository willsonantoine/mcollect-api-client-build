"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const compte_model_1 = __importDefault(require("../../../shared/models/compte.model"));
const compte_classes_model_1 = __importDefault(require("../../../shared/models/compte.classes.model"));
const operations_service_1 = __importDefault(require("./operations.service"));
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const members_service_1 = __importDefault(require("../../auth/services/members.service"));
const journal_model_1 = __importDefault(require("../../../shared/models/journal.model"));
const sequelize_2 = __importDefault(require("../../../shared/utils/sequelize"));
const operations_exemple_model_1 = __importDefault(require("../../../shared/models/operations.exemple.model"));
const operations_model_1 = __importDefault(require("../../../shared/models/operations.model"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
const AccountClass_1 = require("../../../shared/storage/AccountClass");
class ComptesService {
    constructor() {
        this.createAccount = async ({ number, description, name, memberId, classId, }) => {
            if (number) {
                const existing = await this.findAccountByNumber(number);
                if (!existing) {
                    return await this.comptesModel.create({
                        name,
                        number,
                        description,
                        memberId,
                        classId,
                    });
                }
            }
        };
        this.findAll = async ({ limit, offset, search, classeId, }) => {
            const whereTarget = {};
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { id: { [sequelize_1.Op.like]: `%${search}%` } },
                    { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    { number: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            if (classeId) {
                whereTarget.classId = classeId;
            }
            return await this.comptesModel.findAndCountAll({
                where: whereTarget,
                limit,
                offset,
                order: [
                    ["favorit", "desc"],
                    ["createdAt", "DESC"],
                    ["updatedAt", "desc"],
                ],
                include: [{ model: compte_classes_model_1.default, as: "classe" }],
            });
        };
        this.setMemberId = async (accountId, memberId) => {
            const existMember = await this.membersService.findById(memberId);
            if (existMember) {
                return await this.comptesModel.update({ memberId }, { where: { id: accountId }, returning: false });
            }
            else {
                console.log("Member not exist");
            }
        };
        this.setNumber = async (accountId) => {
            if (accountId) {
                return sequelize_2.default.query(`UPDATE comptabilite_compte set id_ref='${accountId}' where id='${accountId}'`);
            }
        };
        this.findClass = async () => {
            const countClass = await this.classeModel.count();
            if (countClass !== AccountClass_1.AccountClass.length) {
                for (const item of AccountClass_1.AccountClass) {
                    await this.classeModel.create({
                        designation: item.designation,
                        type: item.type,
                        number: item.numero,
                        description: item.designation,
                        status: 1,
                    });
                }
            }
            return this.classeModel.findAndCountAll({ order: [["numero", "asc"]] });
        };
        this.findAccount = async ({ accountId, currencyId, date1, search, date2, type, limit, offset, }) => {
            const account = await this.comptesModel.findOne({
                where: { id: accountId },
                attributes: [
                    "id",
                    "name",
                    "description",
                    "accountStatus",
                    "number",
                    "memberId",
                    "isActif",
                    "createdAt",
                    "updatedAt",
                    "isPeriodique",
                    "formuleBalance",
                    "isVerifyBalance"
                ],
                include: [
                    {
                        model: compte_classes_model_1.default,
                        as: "classe",
                        attributes: ["id", "designation", "number", "type"],
                    },
                    {
                        model: members_model_1.default,
                        as: "member",
                        attributes: [
                            "id",
                            "fullname",
                            "phone",
                            "img",
                            "mail",
                            "gender",
                            "etat_civil",
                            "adress",
                            "createdAt",
                            "updatedAt",
                        ],
                    },
                ],
            });
            if (!(account === null || account === void 0 ? void 0 : account.number)) {
                await this.setNumber(account === null || account === void 0 ? void 0 : account.id);
            }
            const { operations, totalByType } = await this.operationService.findAll({
                accountId,
                currencyId,
                date1,
                limit,
                offset,
                search,
                date2,
                type,
            });
            return {
                account,
                operations,
                totalByType,
            };
        };
        this.getBalance = async ({ accountId, currencyId, date1, date2, }) => {
            var _a;
            const account = await this.comptesModel.findByPk(accountId, {
                include: [{ model: compte_classes_model_1.default, as: "classe" }],
            });
            if (account) {
                const whereCredit = {
                    type: "CREDIT",
                    accountIdFrom: accountId,
                    currencyId,
                    operationId: {
                        [sequelize_1.Op.not]: null, // This ensures id_operation is not null
                    },
                    createdAt: {
                        [sequelize_1.Op.and]: [
                            (0, sequelize_1.literal)(`DATE(JournalModel.createAt) >= '${date1}'`),
                            (0, sequelize_1.literal)(`DATE(JournalModel.createAt) <= '${date2}'`),
                        ],
                    },
                };
                const sumAmountCredit = await this.journalModel.sum("amount", {
                    where: whereCredit,
                });
                const whereDebit = {
                    type: "DEBIT",
                    accountIdFrom: accountId,
                    currencyId,
                    operationId: {
                        [sequelize_1.Op.not]: null, // This ensures id_operation is not null
                    },
                    createdAt: {
                        [sequelize_1.Op.and]: [
                            (0, sequelize_1.literal)(`DATE(JournalModel.createAt) >= '${date1}'`),
                            (0, sequelize_1.literal)(`DATE(JournalModel.createAt) <= '${date2}'`),
                        ],
                    },
                };
                const sumAmountDebit = await this.journalModel.sum("amount", {
                    where: whereDebit,
                });
                let sold = 0;
                if (account.formuleBalance) {
                    if (account.formuleBalance === "D-C") {
                        sold = sumAmountDebit - sumAmountCredit;
                    }
                    else {
                        sold = sumAmountCredit + sumAmountDebit;
                    }
                }
                else if ((_a = account.classe) === null || _a === void 0 ? void 0 : _a.number) {
                    sold = ["1", "3", "7", "4"].includes(account.classe.number)
                        ? sumAmountCredit - sumAmountDebit
                        : sumAmountDebit - sumAmountCredit;
                }
                return { credit: sumAmountCredit, debit: sumAmountDebit, sold };
            }
            return { credit: 0, debit: 0, sold: 0 };
        };
        this.findAccountByNumber = async (number) => {
            return this.comptesModel.findOne({ where: { number } });
        };
        this.findAccountById = async (id) => {
            return this.comptesModel.findOne({
                where: { id },
                include: [{ model: compte_classes_model_1.default, as: "classe" }],
            });
        };
        this.UpdateAccountInfos = async (id, data) => {
            return await this.comptesModel.update(data, {
                where: { id },
                returning: true,
            });
        };
        this.getAccountByMemberId = async (memberId) => {
            return await this.comptesModel.findOne({ where: { memberId } });
        };
        this.getNextAccount = async (classId) => {
            return await this.comptesModel.count({
                where: { classId },
                paranoid: false,
            });
        };
        this.getOperationExemple = async () => {
            const countOpExemple = await this.operationsExempleModel.count();
            if (countOpExemple === 0) {
                await this.operationsExempleModel.create({
                    amount: 0,
                    name: "Entrée en caisse",
                    type: "ENTREE",
                });
                await this.operationsExempleModel.create({
                    amount: 0,
                    name: "Dépense",
                    type: "SORTIE",
                });
            }
            return await this.operationsExempleModel.findAndCountAll({
                order: [["createdAt", "desc"]],
                include: [
                    {
                        model: compte_model_1.default,
                        as: "accountFrom",
                        attributes: ["id", "name", "number"],
                    },
                    {
                        model: compte_model_1.default,
                        as: "accountTo",
                        attributes: ["id", "name", "number"],
                    },
                ],
            });
        };
        this.getPartSocialHistoryAggregated = async ({ currencyId = "", offset, limit, accountId = "", gender = "", partSocialAccountId, search = "", amountMin = 0, amountMax = 1000, year = "", }) => {
            const whereTarget = {
                id_operation: {
                    [sequelize_1.Op.not]: null, // This ensures id_operation is not null
                },
                accountIdTo: partSocialAccountId,
            };
            const whereOperationTarget = {};
            if (currencyId) {
                whereOperationTarget.currencyId = currencyId;
            }
            if (accountId) {
                whereTarget.accountIdFrom = accountId;
            }
            const whereAccount = {};
            if (search) {
                whereAccount[sequelize_1.Op.or] = [
                    { id: { [sequelize_1.Op.like]: `%${search}%` } },
                    { name: { [sequelize_1.Op.like]: `%${search}%` } },
                    { number: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            const whereMember = {};
            if (gender) {
                whereMember.gender = gender;
            }
            //Year filtering
            const currentYear = new Date().getFullYear();
            const targetYear = year ? parseInt(year.toString()) : currentYear; // Ensure year is a number, default to current year
            const lastYear = targetYear - 1;
            // 1. Aggregate by accountFrom and currency with account and member info
            const { rows: aggregatedByAccountAndCurrency, count } = await this.journalModel.findAndCountAll({
                attributes: [
                    [(0, sequelize_1.col)("accountFrom.id"), "accountId"], // Alias account ID
                    [(0, sequelize_1.col)("accountFrom.designation"), "accountName"], //Add Account Name
                    [(0, sequelize_1.col)("accountFrom.id_ref"), "accountNumber"], //Add Account Number
                    [(0, sequelize_1.col)("operation->currency.id"), "currencyId"], // Alias currency ID
                    [(0, sequelize_1.col)("operation->currency.designation"), "currencyName"], // Add currency name
                    //Conditional aggregation for current year
                    [
                        (0, sequelize_1.fn)("SUM", (0, sequelize_1.literal)(`CASE WHEN YEAR(JournalModel.createAt) = ${currentYear} THEN JournalModel.montant ELSE 0 END`)),
                        "totalAmountCurrentYear",
                    ],
                    //Conditional aggregation for last year
                    [
                        (0, sequelize_1.fn)("SUM", (0, sequelize_1.literal)(`CASE WHEN YEAR(JournalModel.createAt) < ${currentYear} THEN JournalModel.montant ELSE 0 END`)),
                        "totalAmountLastYear",
                    ],
                ],
                where: Object.assign(Object.assign({}, whereTarget), { montant: {
                        [sequelize_1.Op.gte]: amountMin,
                        [sequelize_1.Op.lte]: amountMax,
                    } }),
                include: [
                    {
                        model: operations_model_1.default,
                        as: "operation",
                        where: whereOperationTarget,
                        required: true,
                        attributes: [], // Don't need other operation attributes
                        include: [
                            { model: currency_model_1.default, as: "currency", attributes: ["name"] },
                        ], // Only need currency name
                    },
                    {
                        model: compte_model_1.default,
                        as: "accountFrom",
                        attributes: [], // Don't need other account attributes
                        where: whereAccount,
                        required: true,
                        // include: [
                        //   {
                        //     // Include the member information
                        //     model: MemberModel, // Replace MemberModel with your actual model
                        //     as: "member", // Assuming your CompteModel has a relation named 'member'
                        //     where: whereMember,
                        //     attributes: ["fullname", "gender", "phone", "mail", "img", "joinedAt"], // Select member attributes
                        //   },
                        // ],
                    },
                ],
                limit,
                offset,
                group: [(0, sequelize_1.col)("accountFrom.id"), (0, sequelize_1.col)("operation->currency.id")], // Group by account and currency
                raw: true, // Get plain objects
                subQuery: false, // Add this to allow limit/offset with group by
            });
            // 2. Aggregate total by currency -  Adjusted for clarity
            const totalByCurrency = await this.journalModel.findAll({
                attributes: [
                    [(0, sequelize_1.col)("operation->currency.id"), "currencyId"],
                    [(0, sequelize_1.col)("operation->currency.designation"), "currencyName"], // Add currency name
                    //Conditional aggregation for current year
                    [
                        (0, sequelize_1.fn)("SUM", (0, sequelize_1.literal)(`CASE WHEN YEAR(JournalModel.createAt) = ${currentYear} THEN JournalModel.montant ELSE 0 END`)),
                        "totalAmountCurrentYear",
                    ],
                    //Conditional aggregation for last year
                    [
                        (0, sequelize_1.fn)("SUM", (0, sequelize_1.literal)(`CASE WHEN YEAR(JournalModel.createAt) < ${currentYear} THEN JournalModel.montant ELSE 0 END`)),
                        "totalAmountLastYear",
                    ],
                ],
                where: Object.assign(Object.assign({}, whereTarget), { montant: {
                        [sequelize_1.Op.gte]: amountMin,
                        [sequelize_1.Op.lte]: amountMax,
                    } }),
                include: [
                    {
                        model: operations_model_1.default,
                        as: "operation",
                        where: whereOperationTarget,
                        required: true, // Important: Use a required join to enforce the condition
                        attributes: [],
                        include: [
                            { model: currency_model_1.default, as: "currency", attributes: ["name"] },
                        ],
                    },
                    {
                        model: compte_model_1.default,
                        as: "accountFrom",
                        required: true, // Important: Use a required join to enforce the condition
                        attributes: [], // Don't need other account attributes
                        where: whereAccount,
                        // include: [
                        //   {
                        //     // Include the member information
                        //     model: MemberModel, // Replace MemberModel with your actual model
                        //     as: "member", // Assuming your CompteModel has a relation named 'member'
                        //     attributes: [], // Select member attributes
                        //     where: whereMember,
                        //   },
                        // ],
                    },
                ],
                group: [(0, sequelize_1.col)("operation->currency.id")],
                raw: true,
            });
            return {
                aggregatedByAccountAndCurrency,
                totalByCurrency,
                count: count.length,
            };
        };
        this.getPartSocialHistoryAggregatedByAccount = async ({ currencyId = "", accountId, partSocialAccountId, }) => {
            const whereTarget = { accountIdTo: partSocialAccountId };
            const whereOperationTarget = {};
            if (currencyId) {
                whereOperationTarget.currencyId = currencyId;
            }
            const whereAccount = { id: accountId }; // Filtrer directement par accountId
            // 2. Aggregate total by currency
            return await this.journalModel.findAll({
                attributes: [
                    [(0, sequelize_1.col)("operation->currency.id"), "currencyId"],
                    [(0, sequelize_1.col)("operation->currency.designation"), "currencyName"],
                    [(0, sequelize_1.literal)("SUM(JournalModel.montant)"), "amount"],
                ],
                where: Object.assign({}, whereTarget),
                include: [
                    {
                        model: operations_model_1.default,
                        as: "operation",
                        where: whereOperationTarget,
                        required: true,
                        attributes: [],
                        include: [
                            { model: currency_model_1.default, as: "currency", attributes: ["name"] },
                        ],
                    },
                    {
                        model: compte_model_1.default,
                        as: "accountFrom",
                        required: true,
                        attributes: [],
                        where: whereAccount,
                    },
                ],
                group: [(0, sequelize_1.col)("operation->currency.id")],
                raw: true,
            });
        };
        this.selectAccount = async (accountId) => {
            return await this.comptesModel.increment(["favorit"], {
                where: { id: accountId },
            });
        };
        this.comptesModel = compte_model_1.default;
        this.classeModel = compte_classes_model_1.default;
        this.operationService = new operations_service_1.default();
        this.membersService = new members_service_1.default();
        this.journalModel = journal_model_1.default;
        this.operationsExempleModel = operations_exemple_model_1.default;
    }
}
exports.default = ComptesService;
