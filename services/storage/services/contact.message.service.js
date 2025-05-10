"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const contact_messages_1 = __importDefault(require("../../../shared/models/contact.messages"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
class ContactMessageService {
    constructor() {
        this.create = async (data) => {
            return await this.contactMessageModel.create(data);
        };
        this.findAll = async ({ limit, offset, search, siteId, }) => {
            const whereTarget = { siteId };
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { motif: { [sequelize_1.Op.like]: `%${search}%` } },
                    { number: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            return await this.contactMessageModel.findAndCountAll({
                offset,
                limit,
                where: whereTarget,
                order: [["createdAt", "desc"]],
                include: [
                    {
                        model: users_model_1.default,
                        as: "userHasRead",
                        attributes: ["id", "username", "avatar"],
                    },
                ],
            });
        };
        this.contactMessageModel = contact_messages_1.default;
    }
}
exports.default = ContactMessageService;
