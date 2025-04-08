"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const exercice_comptable_1 = __importDefault(require("../../../shared/models/exercice.comptable"));
class ExecriceComptableService {
    constructor() {
        this.create = async (data) => {
            return await this.excerciceModel.create(data);
        };
        this.update = async (id, data) => {
            return await this.excerciceModel.update(data, {
                where: { id },
                returning: true,
            });
        };
        this.findExercice = async (name) => {
            return this.excerciceModel.findOne({ where: { name } });
        };
        this.findAll = async ({ limit, offset, }) => {
            return await this.excerciceModel.findAndCountAll({
                offset,
                limit,
                order: [["createdAt", "desc"]],
            });
        };
        this.setDefault = async (id) => {
            await this.excerciceModel.update({ isDefault: false }, { returning: true, where: { isDefault: true } });
            return await this.excerciceModel.update({ isDefault: true }, { returning: true, where: { id } });
        };
        this.deleteExercice = async (id) => {
            return await this.excerciceModel.destroy({ where: { id } });
        };
        this.findOne = async (id) => {
            return await this.excerciceModel.findOne({ where: { id } });
        };
        this.getCurrentExercice = async () => {
            return await this.excerciceModel.findOne({ where: { isDefault: true } });
        };
        this.excerciceModel = exercice_comptable_1.default;
    }
}
exports.default = ExecriceComptableService;
