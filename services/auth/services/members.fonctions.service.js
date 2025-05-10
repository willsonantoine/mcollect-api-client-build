"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const members_category_model_1 = __importDefault(require("../../../shared/models/members.category.model"));
class MemberFonctionsService {
    constructor() {
        this.findAll = async ({ limit, offset, search = "", }) => {
            const whereTarget = {};
            if (search) {
                whereTarget.name = { [sequelize_1.Op.like]: `%${search}%` };
                whereTarget.description = { [sequelize_1.Op.like]: `%${search}%` };
            }
            return await this.memberFonctionModel.findAndCountAll({
                where: whereTarget,
                limit,
                offset,
                attributes: ["id", "name", "description", "createdAt", "updatedAt"],
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
            });
        };
        this.create = async (data) => {
            return await this.memberFonctionModel.create(data);
        };
        this.update = async (id, data) => {
            return await this.memberFonctionModel.update(data, { where: { id } });
        };
        this.delete = async (id) => {
            return await this.memberFonctionModel.destroy({ where: { id } });
        };
        this.findByName = async (name) => {
            return await this.memberFonctionModel.findOne({ where: { name } });
        };
        this.memberFonctionModel = members_category_model_1.default;
    }
}
exports.default = MemberFonctionsService;
