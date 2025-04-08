"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationType = void 0;
const sequelize_1 = require("sequelize");
const operations_model_1 = __importDefault(require("../../../shared/models/operations.model"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
const compte_model_1 = __importDefault(require("../../../shared/models/compte.model"));
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
const users_roles_1 = __importDefault(require("../../../shared/models/users.roles"));
const comptes_service_1 = __importDefault(require("./comptes.service"));
const vars_1 = require("../../../shared/utils/vars");
const exercice_comptable_1 = __importDefault(require("../../../shared/models/exercice.comptable"));
const exercice_comptable_2 = __importDefault(require("../../../shared/models/exercice.comptable"));
const journal_model_1 = __importDefault(require("../../../shared/models/journal.model"));
const operations_billetage_model_1 = __importDefault(require("../../../shared/models/operations.billetage.model"));
const journal_service_1 = __importDefault(require("./journal.service"));
const credit_service_1 = __importDefault(require("./credit.service"));
const billetage_service_1 = __importDefault(require("./billetage.service"));
const succursale_model_1 = __importDefault(require("../../../shared/models/succursale.model"));
const CurrencyList_1 = require("../../../shared/storage/CurrencyList");
var OperationType;
(function (OperationType) {
    OperationType["DEPOT"] = "DEPOT";
    OperationType["RETRAIT"] = "RETRAIT";
    OperationType["VIREMENT"] = "VIREMENT";
    OperationType["PAYEMENT"] = "PAYEMENT";
    OperationType["ENTREE"] = "ENTREE";
    OperationType["SORTIE"] = "SORTIE";
    OperationType["CREDIT"] = "CREDIT";
})(OperationType || (exports.OperationType = OperationType = {}));
class OperationsServices {
    constructor() {
        this.findAll = async ({ accountId, currencyId, date1, date2, type, limit, offset, search, status = true, }) => {
            const whereTarget = {
                status,
                createdAt: {
                    [sequelize_1.Op.and]: [
                        (0, sequelize_1.literal)(`DATE(OperationModel.date_save) >= '${date1}'`),
                        (0, sequelize_1.literal)(`DATE(OperationModel.date_save) <= '${date2}'`),
                    ],
                },
            };
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { motif: { [sequelize_1.Op.like]: `%${search}%` } },
                    { number: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            if (accountId) {
                whereTarget[sequelize_1.Op.or] = [
                    ...(whereTarget[sequelize_1.Op.or] || []),
                    { accountFromId: accountId },
                    { accountToId: accountId },
                ];
            }
            if (currencyId) {
                whereTarget.currencyId = currencyId;
            }
            if (type) {
                whereTarget.type = type;
            }
            const totalByType = await this.operationModel.findAll({
                attributes: [
                    "type",
                    "id_devise",
                    [(0, sequelize_1.literal)("SUM(montant)"), "totalAmount"],
                    [(0, sequelize_1.literal)("COUNT(id)"), "operationCount"], // Add this line to count operations
                ],
                where: whereTarget,
                group: ["type", "id_devise"],
                raw: true, // Ensure raw: true is included for easier data access
            });
            const operations = await this.operationModel.findAndCountAll({
                where: whereTarget,
                limit,
                offset,
                order: [
                    ["number", "desc"],
                    ["date_save", "asc"],
                ],
                include: [
                    { model: currency_model_1.default, as: "currency", attributes: ["id", "name"] },
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
                    {
                        model: members_model_1.default,
                        as: "beneficiaire",
                        attributes: ["id", "fullname", "gender", "phone", "img"],
                    },
                    {
                        model: users_model_1.default,
                        as: "userCreated",
                        attributes: ["id", "username", "avatar"],
                        include: [
                            { model: users_roles_1.default, as: "role", attributes: ["id", "name"] },
                        ],
                    },
                    {
                        model: succursale_model_1.default,
                        as: "succursale",
                        attributes: ["id", "name"],
                    },
                ],
            });
            return { totalByType, operations };
        };
        this.findOperationByNum = async (number) => {
            return await this.operationModel.findOne({ where: { number } });
        };
        this.findOperationById = async (id) => {
            return await this.operationModel.findByPk(id);
        };
        this.findOperationByIdAndSuccursale = async ({ number, operationId, succursaleId, }) => {
            console.log("INCOMMING PARAMS ===> ", number, operationId, succursaleId);
            return await this.operationModel.findOne({ where: { id: operationId } });
        };
        this.updateOperation = async (id, data) => {
            return await this.operationModel.update(data, { where: { id } });
        };
        this.getNextNumber = async () => {
            const countOperations = await this.operationModel.count({
                paranoid: false,
            });
            const nextNumber = countOperations + 1;
            return String(nextNumber);
        };
        this.findCurrencys = async () => {
            const countCurrency = await this.currencyModel.count();
            if (countCurrency === 0) {
                for (const item of CurrencyList_1.CurrencyList) {
                    await this.currencyModel.create({
                        coupure: item.coupure,
                        name: item.designation,
                        description: item.description,
                        taux: item.taux,
                    });
                }
            }
            return this.currencyModel.findAll({ order: [["status", "asc"]] });
        };
        this.getCurrency = async (id) => {
            return this.currencyModel.findByPk(id, { attributes: ["id", "name"] });
        };
        this.getCurrencyId = async (name) => {
            const find = await this.currencyModel.findOne({ where: { name } });
            return (find === null || find === void 0 ? void 0 : find.id) || null;
        };
        this.deleteOperations = async (id, userDeletedId) => {
            await this.operationModel.update({ userDeleted: userDeletedId, userDeletedAt: new Date() }, { where: { id }, returning: true });
            await this.journalModel.destroy({ where: { operationId: id } });
            await this.operationBilletageModel.destroy({ where: { operationId: id } });
            return this.operationModel.destroy({ where: { id } });
        };
        this.validateOperation = async (id, userId) => {
            await this.operationModel.update({ status: 1, updatedAt: new Date() }, { where: { id }, returning: true });
            const operation = await this.operationModel.findByPk(id);
            if (operation) {
                await this.journalService.create({
                    accountToId: operation === null || operation === void 0 ? void 0 : operation.accountToId,
                    accountFromId: operation === null || operation === void 0 ? void 0 : operation.accountFromId,
                    operationId: operation === null || operation === void 0 ? void 0 : operation.id,
                    currencyId: operation === null || operation === void 0 ? void 0 : operation.currencyId,
                    createdAt: operation === null || operation === void 0 ? void 0 : operation.date_save,
                    libelle: operation === null || operation === void 0 ? void 0 : operation.motif,
                    number: operation === null || operation === void 0 ? void 0 : operation.number,
                    amount: operation === null || operation === void 0 ? void 0 : operation.amount,
                });
                this.billetageService
                    .cumulateBilletage(operation.id, operation.type)
                    .then(() => console.log(`Transaction Billetage with success`));
            }
            else {
                console.log("Operation not found");
            }
            return operation;
        };
        this.createFromSynchro = async (data) => {
            return await this.operationModel.create(data);
        };
        this.create = async (data, creditId) => {
            if (!data) {
                return {
                    Operation: null,
                    observation: `Donnée manquante`, // Correction de l'orthographe
                    status: false,
                };
            }
            if (data.accountToId === data.accountFromId) {
                return {
                    Operation: null,
                    observation: `Le compte à créditer et le compte à débuter doivent differer`, // Correction de l'orthographe
                    status: false,
                };
            }
            const accountService = new comptes_service_1.default(); // Instanciez une seule fois
            try {
                if (data.type === OperationType.VIREMENT) {
                    const accountCredit = await this.validateVirement(data, accountService);
                    if (!accountCredit) {
                        return {
                            Operation: null,
                            observation: `Le compte de crédit avec l'ID ${data.accountToId} est introuvable.`, // Observation plus informative
                            status: false,
                        };
                    }
                }
                else if (data.type === OperationType.RETRAIT) {
                    const accountRetrait = await this.validateRetrait(data, accountService);
                    if (!accountRetrait) {
                        return {
                            Operation: null,
                            observation: `Le compte de retrait avec l'ID ${data.accountFromId} est introuvable.`, // Observation plus informative
                            status: false,
                        };
                    }
                }
                else if (data.type === OperationType.PAYEMENT) {
                    const accountPayement = await this.validatePayment(data, accountService);
                    if (!accountPayement) {
                        return {
                            Operation: null,
                            observation: `Le compte de payement avec l'ID ${data.accountFromId} est introuvable.`, // Observation plus informative
                            status: false,
                        };
                    }
                }
                const result = await this.operationModel.create(data);
                if (result.isRemboursement) {
                    const creditService = new credit_service_1.default();
                    await creditService.payerCredit({
                        id: creditId || "",
                        amount: data.amount || 0,
                        operationId: result.id,
                        userCreateId: result.userCreatedId || "",
                    });
                }
                return {
                    Operation: result,
                    observation: `Création de l'opération réussie avec succès`,
                    status: true,
                };
            }
            catch (error) {
                console.error("Erreur lors de la création de l'opération :", error);
                return {
                    Operation: null,
                    observation: `Erreur lors de la création de l'opération: ${error.message}`, // Observation plus informative avec le message d'erreur
                    status: false,
                };
            }
        };
        this.operationModel = operations_model_1.default;
        this.currencyModel = currency_model_1.default;
        this.exerciceComptable = exercice_comptable_1.default;
        this.journalModel = journal_model_1.default;
        this.operationBilletageModel = operations_billetage_model_1.default;
        this.journalService = new journal_service_1.default();
        this.billetageService = new billetage_service_1.default();
    }
    async validateVirement(data, accountService) {
        const accountCredit = await accountService.findAccountById(data.accountToId);
        if (!accountCredit) {
            return null;
        }
        if (!accountCredit.isVerifyBalance) {
            return accountCredit;
        }
        let date1 = "2000-01-01";
        let date2 = (0, vars_1.formatDateSql)(new Date());
        if (accountCredit.isPeriodique) {
            const periode = await exercice_comptable_2.default.findOne({
                where: { isDefault: true },
            });
            if (periode) {
                date1 = (0, vars_1.formatDateSql)(periode.date1);
                date2 = (0, vars_1.formatDateSql)(periode.date2);
            }
        }
        const balance = await accountService.getBalance({
            accountId: accountCredit.id,
            date1,
            date2,
            currencyId: data.currencyId,
        });
        const currency = await this.getCurrency(data.currencyId);
        if (data.amount > balance.sold) {
            throw new Error(`Désolé, vous ne pouvez pas effectuer cette opération. La balance actuelle du compte N° ${(0, vars_1.sanitarizeId)(accountCredit.id, accountCredit.number)} de ${accountCredit.name} est de ${balance.sold}  ${currency === null || currency === void 0 ? void 0 : currency.name}`); // Lancer une exception
        }
        return accountCredit;
    }
    async validateRetrait(data, accountService) {
        const accountRetrait = await accountService.findAccountById(data.accountToId);
        if (!accountRetrait) {
            return null;
        }
        if (!accountRetrait.isVerifyBalance) {
            return accountRetrait;
        }
        let date1 = "2000-01-01";
        let date2 = (0, vars_1.formatDateSql)(new Date());
        const balance = await accountService.getBalance({
            accountId: accountRetrait.id,
            date1,
            date2,
            currencyId: data.currencyId,
        });
        const currency = await this.getCurrency(data.currencyId);
        if (data.amount > balance.sold) {
            throw new Error(`Désolé, vous ne pouvez pas effectuer cette opération. La balance actuelle est de ${balance.sold} ${currency === null || currency === void 0 ? void 0 : currency.name} au compte N° ${(0, vars_1.sanitarizeId)(accountRetrait.id, accountRetrait.number)} de ${accountRetrait.name}`); // Lancer une exception
        }
        return accountRetrait;
    }
    async validatePayment(data, accountService) {
        const accountPayement = await accountService.findAccountById(data.accountToId);
        if (!accountPayement) {
            return null;
        }
        if (!accountPayement.isVerifyBalance) {
            return accountPayement;
        }
        let date1 = "2000-01-01";
        let date2 = (0, vars_1.formatDateSql)(new Date());
        const balance = await accountService.getBalance({
            accountId: accountPayement.id,
            date1,
            date2,
            currencyId: data.currencyId,
        });
        if (data.amount > balance.sold) {
            throw new Error(`Désolé, vous ne pouvez pas effectuer cette opération. La balance actuelle est de ${balance.sold}`); // Lancer une exception
        }
        return accountPayement;
    }
}
exports.default = OperationsServices;
