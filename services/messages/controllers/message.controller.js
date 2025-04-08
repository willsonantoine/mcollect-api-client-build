"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const message_service_1 = __importDefault(require("../services/message.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
const operations_service_1 = __importDefault(require("../../comptabilite/services/operations.service"));
const settings_service_1 = __importDefault(require("../../gateway/services/settings.service"));
const comptes_service_1 = __importDefault(require("../../comptabilite/services/comptes.service"));
class MessageController {
    constructor() {
        this.send = async (req, res) => {
            try {
                const { message, phone, transactionForCustomer } = req.body;
                const userId = req.user.id;
                const messageObject = await this.messageService.send({
                    message,
                    phone,
                    userCreatedId: userId,
                });
                if (!messageObject) {
                    return (0, response_util_1.setResponse)({
                        res,
                        statusCode: 500,
                        message: "Failed to send message.",
                    }); //Or a more appropriate status code
                }
                if (transactionForCustomer === "true") {
                    await this.handleTransaction(messageObject, userId, res);
                }
                (0, response_util_1.setResponse)({
                    res,
                    message: "Envoie message en cours...",
                    data: messageObject,
                });
            }
            catch (error) {
                console.error("Error in send:", error); // Log the error for debugging
                (0, response_util_1.setResponse)({ res, statusCode: 500, message: error.message, error });
            }
        };
        this.handleTransaction = async (messageObject, userId, res) => {
            try {
                const number = await this.operationsService.getNextNumber();
                const accountMember = await this.compteService.getAccountByMemberId(messageObject.memberId);
                const entreprise = await this.settingsService.getEntrepriseInformations();
                if (!entreprise) {
                    return console.log("Entreprise information not found"); // Don't throw, log instead
                }
                if (!accountMember) {
                    return console.log("Compte de client non trouvé"); // Don't throw, log instead
                }
                const id = (0, vars_1.generateUniqueId)();
                const { Operation } = await this.operationsService.create({
                    id,
                    accountFromId: entreprise.smsAccountId,
                    accountToId: accountMember.id,
                    amount: entreprise.smsCost,
                    amount_in_letter: "",
                    currencyId: entreprise.smsCurrencyId,
                    date_save: new Date(),
                    memberId: messageObject === null || messageObject === void 0 ? void 0 : messageObject.memberId,
                    motif: `Frais d'envoie SMS de récouvrement Ref : ${messageObject === null || messageObject === void 0 ? void 0 : messageObject.number}`,
                    number,
                    type: "PAYEMENT",
                    userCreatedId: userId,
                });
                if (Operation) {
                    console.log(`Transaction enregistré avec success :: ${Operation.id}`);
                }
            }
            catch (error) {
                //If there's an error in the transaction, log it, but do not throw an exception.
                console.error("Error creating transaction:", error);
                //It might be good to have the ability to set an error message to the response here.
            }
        };
        this.findAll = async (req, res) => {
            try {
                const { search, status = 1 } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.messageService.findAll({
                    status: status,
                    search,
                    offset,
                    limit,
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({ res, statusCode: 500, message: error.message, error });
            }
        };
        this.resend = async (req, res) => {
            try {
                const { id } = req.params;
                const result = await this.messageService.resendMessage(id);
                if (result) {
                    await this.messageService.updateStatusMessage(id);
                    (0, response_util_1.setResponse)({
                        res,
                        data: result,
                    });
                }
                else {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Erreur d'envoie du message`,
                        statusCode: 400,
                    });
                }
            }
            catch (error) {
                (0, response_util_1.setResponse)({ res, statusCode: 500, message: error.message, error });
            }
        };
        this.messageService = new message_service_1.default();
        this.operationsService = new operations_service_1.default();
        this.settingsService = new settings_service_1.default();
        this.compteService = new comptes_service_1.default();
    }
}
exports.default = new MessageController();
