"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = __importDefault(require("../../../shared/models/messages"));
const entreprise_model_1 = __importDefault(require("../../../shared/models/entreprise.model"));
const members_service_1 = __importDefault(require("../../auth/services/members.service"));
const axios_1 = __importDefault(require("axios"));
const vars_1 = require("../../../shared/utils/vars");
const sequelize_1 = require("sequelize");
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const members_model_2 = __importDefault(require("../../../shared/models/members.model"));
class MessageService {
    constructor() {
        this.url = "";
        this.token = "";
        this.sender_name = "";
        this.send = async ({ message, phone, userCreatedId, }) => {
            var _a;
            let messageStored;
            try {
                messageStored = await this.save(phone, message, userCreatedId);
                console.log(messageStored);
                if (!messageStored) {
                    throw new Error("Message could not be saved."); // Throw an error to be caught
                }
                const data = {
                    token: this.token,
                    sender_name: this.sender_name,
                    to: phone,
                    message,
                };
                const request = await axios_1.default.post(this.url, data);
                console.log(request.data);
                const updateData = {
                    status: request.data.status ? 1 : 0, // Default status to 0
                    log: JSON.stringify(request.data), // Store full response for debugging
                };
                // Conditional status based on nested data
                if (request.data.status && ((_a = request.data.data) === null || _a === void 0 ? void 0 : _a.status) === 200) {
                    updateData.status = 1;
                    updateData.log = JSON.stringify(request.data.data); // Update log with nested data
                }
                await this.messageModel.update(updateData, {
                    where: { id: messageStored.id },
                    returning: true,
                });
                return await this.messageModel.findByPk(messageStored.id); // Return the message
            }
            catch (error) {
                // Specify type of error for better handling
                console.error("Error sending message:", error);
                if (messageStored) {
                    // Update the message status to 0 and log the error
                    await this.messageModel.update({ status: 0, log: JSON.stringify(error) }, {
                        where: { id: messageStored.id },
                        returning: true,
                    });
                }
                throw error; // Re-throw the error to be handled by the caller
            }
        };
        this.getToken = async () => {
            if (!this.token) {
                const findToken = await this.entrepriseModel.findOne();
                if (findToken) {
                    this.token = findToken.smsToken;
                    this.sender_name = findToken.smsSendName;
                }
            }
        };
        this.save = async (phone, message, userCreateId) => {
            try {
                const findMember = await this.membersService.findByPhone(phone);
                if (findMember) {
                    const number = (0, vars_1.generateUniqueId)();
                    return await this.messageModel.create({
                        number,
                        message,
                        memberId: findMember.id,
                        userCreateId,
                    });
                }
                else {
                    throw new Error(`Ce numéro de telephone n'existe dans un compte membre`);
                }
            }
            catch (e) {
                console.log(e);
                throw new Error(e);
            }
        };
        this.findAll = async ({ limit, offset, search, status, }) => {
            let whereTarget = {};
            if (search) {
                whereTarget = {
                    [sequelize_1.Op.or]: [
                        { message: { [sequelize_1.Op.like]: `%${search}%` } },
                        { number: { [sequelize_1.Op.like]: `%${search}%` } },
                    ],
                };
            }
            if (status) {
                whereTarget.status = status;
            }
            return await this.messageModel.findAndCountAll({
                where: whereTarget,
                order: [["createdAt", "DESC"]],
                limit,
                offset,
                include: [
                    {
                        model: members_model_1.default,
                        as: "member",
                        attributes: ["id", "fullname", "mail", "gender", "img", "phone"],
                    },
                ],
            });
        };
        this.resendMessage = async (messageId) => {
            try {
                const messageRecord = await this.messageModel.findByPk(messageId, {
                    include: [
                        {
                            model: members_model_2.default,
                            as: "member",
                        },
                    ],
                });
                if (!messageRecord) {
                    throw new Error(`Message with ID ${messageId} not found.`);
                }
                const { message, userCreateId } = messageRecord; // Assuming these exist on the model
                return await this.send({
                    message: message || "",
                    phone: messageRecord.member.phone || "",
                    userCreatedId: userCreateId || "",
                }); // Return the result of the new send attempt
            }
            catch (error) {
                console.error(`Error resending message with ID ${messageId}:`, error);
                throw error; // Re-throw the error for the caller to handle
            }
        };
        this.updateStatusMessage = async (messageId) => {
            return await this.messageModel.update({ status: 1 }, { where: { id: messageId }, returning: true });
        };
        this.messageModel = messages_1.default;
        this.entrepriseModel = entreprise_model_1.default;
        this.membersService = new members_service_1.default();
        this.url = "https://api.mcollecte.com/messages/send";
        this.getToken().then((r) => console.log("Token retrieved"));
    }
}
exports.default = MessageService;
