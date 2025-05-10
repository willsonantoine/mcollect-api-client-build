"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const personnel_service_model_1 = __importDefault(require("../../../shared/models/personnel.service.model"));
class PersonnellServiceService {
    constructor() {
        this.create = async (data) => {
            return await this.personnellServiceModel.create(data);
        };
        this.update = async (id, data) => {
            return await this.personnellServiceModel.update(data, { where: { id } });
        };
        this.findAll = async ({ limit, offset, search, }) => {
            const whereTarget = {};
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { fullname: { [sequelize_1.Op.like]: `%${search}%` } },
                    { phone: { [sequelize_1.Op.like]: `%${search}%` } },
                    { mail: { [sequelize_1.Op.like]: `%${search}%` } },
                    { adress: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            return await this.personnellServiceModel.findAndCountAll({
                limit,
                offset,
                where: whereTarget,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
            });
        };
        this.findOne = async (id) => {
            return await this.personnellServiceModel.findByPk(id);
        };
        this.delete = async (id) => {
            return await this.personnellServiceModel.destroy({ where: { id } });
        };
        this.findByName = async (name) => {
            return await this.personnellServiceModel.findOne({ where: { name } });
        };
        this.personnellServiceModel = personnel_service_model_1.default;
    }
}
exports.default = PersonnellServiceService;
