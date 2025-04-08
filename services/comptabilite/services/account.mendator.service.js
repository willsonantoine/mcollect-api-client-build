"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const account_mendantor_model_1 = __importDefault(require("../../../shared/models/account.mendantor.model"));
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
class AccountMendatorService {
    constructor() {
        this.create = async (data) => {
            return this.accountMendatorModel.create(data);
        };
        this.update = async (id, data) => {
            return this.accountMendatorModel.update(data, {
                where: { id },
                returning: true,
            });
        };
        this.deleteItem = async (id, userDeletedId) => {
            await this.accountMendatorModel.update({ userDeleteId: userDeletedId }, { where: { id }, returning: true });
            return await this.accountMendatorModel.destroy({ where: { id } });
        };
        this.findAll = async (accountId, type) => {
            return await this.accountMendatorModel.findAll({
                where: { accountId: accountId, type },
                order: [["createdAt", "desc"]],
                include: [
                    {
                        model: members_model_1.default,
                        as: "member",
                        attributes: [
                            "id",
                            "number",
                            "fullname",
                            "img",
                            "phone",
                            "mail",
                            "gender",
                            "adress",
                            "type",
                        ],
                    },
                ],
            });
        };
        this.accountMendatorModel = account_mendantor_model_1.default;
    }
}
exports.default = AccountMendatorService;
