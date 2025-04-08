"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
const comptes_service_1 = __importDefault(require("../services/comptes.service"));
const operations_service_1 = __importDefault(require("../services/operations.service"));
const users_service_1 = __importDefault(require("../../auth/services/users.service"));
const settings_service_1 = __importDefault(require("../../gateway/services/settings.service"));
class CompteController {
    constructor() {
        this.findAll = async (req, res) => {
            try {
                const { search, classeId } = req.query;
                const { limit = 10, offset = 0 } = (0, vars_1.pagination)(req);
                const response = await this.comptesService.findAll({
                    limit,
                    offset,
                    search,
                    classeId,
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: response,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findClasse = async (req, res) => {
            try {
                const result = await this.comptesService.findClass();
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getNextAccount = async (req, res) => {
            try {
                const settings = new settings_service_1.default();
                const entrep = await settings.getEntrepriseInformations();
                if (!entrep) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Vous devez configurer la classe des compte membre et les prefix dans la partie paramètre`,
                        statusCode: 400,
                    });
                    return;
                }
                const count = await this.comptesService.getNextAccount(entrep.memberAcountClassId);
                const result = `${entrep.accountNumberPrefix}${count + 1}`;
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findAccountHistory = async (req, res) => {
            try {
                const { id } = req.params;
                const { search, date1, date2, currencyId, type } = req.query;
                const { limit = 10, offset = 0 } = (0, vars_1.pagination)(req);
                const response = await this.comptesService.findAccount({
                    limit,
                    type,
                    offset,
                    search,
                    date1,
                    date2,
                    accountId: id,
                    currencyId,
                });
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findCurrency = async (req, res) => {
            try {
                const response = await this.operationService.findCurrencys();
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findBalance = async (req, res) => {
            try {
                const { date1, date2, currencyId } = req.query;
                const accountId = req.params.id;
                const currentBalance = await this.comptesService.getBalance({
                    accountId,
                    currencyId,
                    date1,
                    date2,
                });
                const reportedBalance = await this.comptesService.getBalance({
                    accountId,
                    currencyId,
                    date1: "2000-01-01",
                    date2: date1,
                });
                const currency = await this.operationService.getCurrency(currencyId);
                (0, response_util_1.setResponse)({
                    res,
                    data: {
                        currency,
                        currentBalance: {
                            sold: currentBalance.sold + reportedBalance.sold,
                            credit: currentBalance.credit + reportedBalance.credit,
                            debit: currentBalance.debit + reportedBalance.debit,
                        },
                        reportedBalance,
                    },
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.UpdateAccountInfos = async (req, res) => {
            try {
                const { name, description, number, isPeriodique, classId, isActif, memberId, formuleBalance, isVerifyBalance } = req.body;
                const id = req.params.id;
                const userId = req.user.id;
                const response = await this.comptesService.UpdateAccountInfos(id, {
                    name,
                    description,
                    number,
                    isActif,
                    isPeriodique,
                    classId,
                    updatedAt: new Date(),
                    memberId: memberId || null,
                    formuleBalance,
                    isVerifyBalance,
                    userUpdatedId: userId
                });
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.createAccountInfos = async (req, res) => {
            try {
                const { name, description, number, isPeriodique, classId, isActif, memberId, formuleBalance, isVerifyBalance } = req.body;
                if (!name && !number) {
                    (0, response_util_1.setResponse)({ res, message: `Le nom de compte et numéro de compte sont obligatoire`, statusCode: 400 });
                    return;
                }
                const userId = req.user.id;
                const exist = await this.comptesService.findAccountByNumber(number);
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: "Ce numéro de compte existe déja",
                        statusCode: 400,
                    });
                    return;
                }
                const response = await this.comptesService.createAccount({
                    name,
                    description,
                    number,
                    isActif,
                    isPeriodique,
                    classId,
                    createdAt: new Date(),
                    memberId: memberId || null,
                    formuleBalance,
                    isVerifyBalance,
                    userCreatedId: userId
                });
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getOperationExemple = async (req, res) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const operation = await this.comptesService.getOperationExemple();
                const allAccessOfUser = await this.userService.getAccessForUser(userId);
                const allType = this.extractOperationType(allAccessOfUser.filter((item) => item.access.type === "operation" && item.status));
                const filterOperationType = operation.rows.filter((item) => allType.includes(item.type));
                (0, response_util_1.setResponse)({
                    res,
                    data: { rows: filterOperationType, count: operation.count },
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.extractOperationType = (accessList) => {
            var _a;
            const opType = [];
            for (const op of accessList) {
                opType.push(((_a = op.access) === null || _a === void 0 ? void 0 : _a.name) || "");
            }
            return opType;
        };
        this.getPartSocial = async (req, res) => {
            try {
                const { accountId, currencyId, gender, year, amountMin, search, amountMax, } = req.query;
                const settings = new settings_service_1.default();
                const entrep = await settings.getEntrepriseInformations();
                if (!entrep) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Veuillez specifier le compte des part social dans les paramètres avant d'efféctuer cette action`,
                        statusCode: 400,
                    });
                    return;
                }
                const { offset, limit } = (0, vars_1.pagination)(req);
                const result = await this.comptesService.getPartSocialHistoryAggregated({
                    partSocialAccountId: entrep.partSocialAccountId,
                    accountId,
                    gender,
                    currencyId,
                    offset,
                    limit,
                    year: parseInt(String(year)),
                    search,
                    amountMax: parseFloat(String(amountMax)),
                    amountMin: parseFloat(String(amountMin)),
                });
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getPartSocialByAccount = async (req, res) => {
            try {
                const { accountId, currencyId } = req.query;
                const settings = new settings_service_1.default();
                const entrep = await settings.getEntrepriseInformations();
                if (!entrep) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Veuillez specifier le compte des part social dans les paramètres avant d'efféctuer cette action`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.comptesService.getPartSocialHistoryAggregatedByAccount({
                    partSocialAccountId: entrep.partSocialAccountId,
                    accountId,
                    currencyId,
                });
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.selectAccount = async (req, res) => {
            try {
                const id = req.params.id;
                const result = await this.comptesService.selectAccount(id);
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.comptesService = new comptes_service_1.default();
        this.operationService = new operations_service_1.default();
        this.userService = new users_service_1.default();
    }
}
exports.default = new CompteController();
