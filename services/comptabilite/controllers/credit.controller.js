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
const credit_service_1 = __importDefault(require("../services/credit.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
const operations_service_1 = __importStar(require("../services/operations.service"));
const comptes_service_1 = __importDefault(require("../services/comptes.service"));
class CreditController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const data = req.body;
                const userId = req.user.id;
                data.id = (0, vars_1.generateUniqueId)();
                // 1. Validate data.number early
                if (!data.number) {
                    data.number = await this.creditService.getNextNumber();
                }
                else {
                    const findOp = await this.operationService.findOperationByNum(data.number);
                    if (findOp) {
                        (0, response_util_1.setResponse)({
                            res,
                            message: "Ce numéro de dossier existe déja dans le system",
                            statusCode: 400,
                        });
                        return;
                    }
                }
                data.remaining = data.amount;
                data.userCreatedId = userId;
                // 2. Find account object first
                const accountObject = await this.compteService.findAccountById(data.accountFromId);
                if (!accountObject) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Aucun membre n'as été trouver pour ce compte`,
                        statusCode: 400,
                    });
                    return;
                }
                if (!accountObject.memberId) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Aucun membre n'est associé à ce compte : ${accountObject.name} : ${accountObject.number}`,
                        statusCode: 400,
                        data: { attachMember: true, account: accountObject },
                    });
                    return;
                }
                // 3. Create the main credit operation
                const operationResult = await this.createCreditOperation(data, accountObject.memberId, userId); // Call the new method
                if (!operationResult.status) {
                    (0, response_util_1.setResponse)({ res, message: operationResult.observation });
                    return;
                }
                // 4. Create the credit record
                const credit = await this.creditService.createCredit(data);
                if (!credit) {
                    // Potentially revert the operation if credit creation fails.
                    // This depends on how critical it is to revert and how your system handles it.
                    (0, response_util_1.setResponse)({
                        res,
                        message: "Failed to create credit. Please check the logs.",
                        statusCode: 500,
                    });
                    return;
                }
                // 5. Create additional operations
                await this.createAdditionalOperations(data, accountObject.memberId, userId, credit); // Call the new method
                // 6. Set the success response
                (0, response_util_1.setResponse)({
                    res,
                    data: credit,
                    message: "Crédit créé avec succès",
                });
            }
            catch (error) {
                console.error("Error creating credit:", error); // Log the error for debugging
                (0, response_util_1.setResponse)({
                    res,
                    message: "Une erreur interne s'est produite",
                    statusCode: 500,
                    error,
                });
            }
        };
        // Helper function to create the main credit operation
        this.createCreditOperation = async (data, memberId, userId) => {
            try {
                const number = await this.operationService.getNextNumber();
                // Add a 1-second delay before creating the operation
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Correct way to pause execution
                const { observation, status, Operation } = await this.operationService.create({
                    id: (0, vars_1.generateUniqueId)(),
                    type: "CREDIT",
                    currencyId: data.currencyId,
                    amount: data.amount,
                    date_save: data.date,
                    motif: data.observation,
                    accountFromId: data.accountFromId,
                    accountToId: data.accountToId,
                    amount_in_letter: data.amountInWords,
                    numero: number,
                    memberId: memberId,
                    userCreatedId: userId,
                });
                if (status) {
                    console.log(`Operation Created ::: ${number}`);
                    data.idOperation = (Operation === null || Operation === void 0 ? void 0 : Operation.id) || null;
                    if (Operation) {
                        await this.operationService.validateOperation(Operation.id, userId);
                    }
                }
                return { observation, status, Operation };
            }
            catch (error) {
                console.error("Error creating credit operation:", error);
                return {
                    observation: "Error creating operation",
                    status: false,
                    Operation: null,
                };
            }
        };
        // Helper function to create additional operations
        this.createAdditionalOperations = async (data, memberId, userId, credit) => {
            const additionnalOperation = data.additionnalOperation || [];
            console.log(additionnalOperation);
            for (const item of additionnalOperation) {
                try {
                    const currentNumber = await this.operationService.getNextNumber();
                    const account = await this.compteService.findAccountById(item.accountId);
                    if (!account) {
                        console.warn(`Account with ID ${item.accountId} not found.`);
                        continue; // Skip to the next iteration if the account is not found
                    }
                    // Add a 1-second delay before creating the operation
                    await new Promise((resolve) => setTimeout(resolve, 1000)); // Correct way to pause execution
                    const { observation, status, Operation } = await this.operationService.create({
                        id: (0, vars_1.generateUniqueId)(),
                        type: operations_service_1.OperationType.PAYEMENT,
                        currencyId: data.currencyId,
                        amount: item.amount,
                        date_save: data.date,
                        motif: `Payement ${account === null || account === void 0 ? void 0 : account.name} pour le crédit : ${credit.number}. Echeance du ${(0, vars_1.formatDateString)(credit.startDate)} au ${(0, vars_1.formatDateString)(credit.endDate)}`,
                        accountFromId: item.accountId,
                        accountToId: data.accountFromId,
                        amount_in_letter: data.amountInWords,
                        numero: currentNumber,
                        memberId: memberId,
                        userCreatedId: userId,
                    });
                    if (status) {
                        console.log(`Additonnal operation created :: ${currentNumber}`);
                    }
                }
                catch (error) {
                    console.error(`Error creating additional operation for account ${item.accountId}:`, error);
                    // Consider what to do if an additional operation fails.
                    // You might want to log the error and continue, or potentially revert the whole transaction.
                }
            }
        };
        this.getCredits = async (req, res) => {
            try {
                const { guarantees = "", reason = "", type = "", search = "", date2 = "", date1 = "", currencyId = "", memberId = "", year = "", month = "", gender = "", } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.creditService.getCredits({
                    month,
                    year,
                    date1,
                    date2,
                    type,
                    limit,
                    offset,
                    search,
                    reason,
                    currencyId,
                    memberId,
                    guarantees,
                    gender,
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
        this.getTotalByTypeAndCurrency = async (req, res) => {
            try {
                const { guarantees = "", reason = "", type = "", search = "", date2 = "", date1 = "", currencyId = "", memberId = "", year = "", month = "", gender = "", } = req.query;
                const result = await this.creditService.getTotalByTypeAndCurrency({
                    month,
                    year,
                    date1,
                    date2,
                    type,
                    search,
                    reason,
                    currencyId,
                    memberId,
                    guarantees,
                    gender,
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
        this.getCountCreditByYears = async (req, res) => {
            try {
                const { currencyId, date1, gender, date2, reason, year } = req.query;
                const resultMonth = year
                    ? await this.creditService.getCreditsByMonth({
                        year,
                        date2,
                        date1,
                        currencyId,
                        gender,
                    })
                    : [];
                const resultYear = await this.creditService.getCountCreditByYears();
                (0, response_util_1.setResponse)({ res, data: { resultYear, resultMonth } });
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
        this.getReasons = async (req, res) => {
            try {
                const { guarantees = "", reason = "", type = "", search = "", date2 = "", date1 = "", currencyId = "", memberId = "", year = "", month = "", gender = "", } = req.query;
                const reuslt = await this.creditService.getAllReason({
                    date1,
                    date2,
                    year,
                    month,
                    gender,
                });
                (0, response_util_1.setResponse)({ res, data: reuslt });
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
        this.updateCreditType = async (req, res) => {
            try {
                const userId = req.user.id;
                const { id, creditType, observation, reste_a_payer, startDate, endDate } = req.body;
                const result = await this.creditService.updateCreditType({
                    id,
                    type: creditType,
                    observation,
                    reste_a_payer,
                    startDate,
                    endDate,
                    userId,
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                    message: "Modification du type réussie",
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
        this.getPenality = async (req, res) => {
            try {
                const days = req.params.days;
                const result = await this.creditService.getPenalitiesPercentage(parseInt(days));
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
        this.getNextNumberOfCredit = async (req, res) => {
            try {
                const result = await this.creditService.getNextNumber();
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
        this.deleteCredit = async (req, res) => {
            try {
                const { id, deletedReason } = req.body;
                const userId = req.user.id;
                const result = await this.creditService.deleteCredit(id, userId, deletedReason);
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
        this.creditService = new credit_service_1.default();
        this.operationService = new operations_service_1.default();
        this.compteService = new comptes_service_1.default();
    }
}
exports.default = new CreditController();
