"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
class SynchroService {
    constructor() {
        this.create = async (data) => {
            return await this.membersModel.create(data);
        };
        this.findCreateMemberId = async ({ id, fullname, phone, }) => {
            const find = await this.membersModel.findByPk(id);
            if (find)
                return find.id;
            const create = await this.membersModel.create({ id, fullname, phone });
            return create.id;
        };
        this.findUserId = async ({ id, username, }) => {
            const find = await this.userModel.findByPk(id);
            if (find)
                return find.id;
            const create = await this.userModel.create({ id, username: username });
            return create.id;
        };
        this.update = async (id, data) => {
            return await this.membersModel.update(data, { where: { id } });
        };
        this.findById = async (id) => {
            return await this.membersModel.findByPk(id);
        };
        this.membersModel = members_model_1.default;
        this.userModel = users_model_1.default;
    }
}
exports.default = SynchroService;
