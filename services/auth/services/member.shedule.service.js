"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const member_schedule_model_1 = __importDefault(require("../../../shared/models/member.schedule.model"));
class MemberSheduleService {
    constructor() {
        this.create = async (data) => {
            return await this.memberSheduleModel.create(data);
        };
        this.findAll = async () => {
            return await this.memberSheduleModel.findAndCountAll();
        };
        this.findById = async (id) => {
            return await this.memberSheduleModel.findByPk(id);
        };
        this.update = async (id, data) => {
            return await this.memberSheduleModel.update(data, {
                where: {
                    id: id,
                },
            });
        };
        this.delete = async (id) => {
            return await this.memberSheduleModel.destroy({
                where: {
                    id: id,
                },
            });
        };
        this.findScheduleByMemberId = async (memberId, serviceId) => {
            return await this.memberSheduleModel.findOne({
                where: {
                    memberId: memberId,
                    personnelServiceId: serviceId,
                },
            });
        };
        this.memberSheduleModel = member_schedule_model_1.default;
    }
}
exports.default = MemberSheduleService;
