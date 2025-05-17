"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const member_schedule_model_1 = __importDefault(require("../../../shared/models/member.schedule.model"));
const personnel_service_model_1 = __importDefault(require("../../../shared/models/personnel.service.model"));
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
class MemberSheduleService {
    constructor() {
        this.create = async (data) => {
            return await this.memberSheduleModel.create(data);
        };
        this.findAll = async ({ memberId, offset, limit, serviceId, dateStart, dateEnd, }) => {
            const whereTarget = {};
            if (serviceId) {
                whereTarget.personnelServiceId = serviceId;
            }
            if (dateStart) {
                whereTarget.dateStart = {
                    [sequelize_1.Op.gte]: (0, sequelize_1.literal)(`DATE(MemberScheduleModel.dateStart) >= '${dateStart}'`),
                };
            }
            if (dateEnd) {
                whereTarget.dateEnd = {
                    [sequelize_1.Op.gte]: (0, sequelize_1.literal)(`DATE(MemberScheduleModel.dateEnd) >= '${dateEnd}'`),
                };
            }
            if (memberId) {
                whereTarget.memberId = memberId;
            }
            return await this.memberSheduleModel.findAndCountAll({
                where: whereTarget,
                offset,
                limit,
                include: [
                    {
                        model: members_model_1.default,
                        as: "member",
                        attributes: [
                            "id",
                            "number",
                            "fullname",
                            "gender",
                            "img",
                            "phone",
                            "mail",
                            "adress",
                        ],
                    },
                    {
                        model: personnel_service_model_1.default,
                        as: "service",
                        attributes: ["id", "name", "description"],
                    },
                ],
            });
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
        this.findScheduleByMemberId = async (memberId, serviceId, dateStart, dateEnd) => {
            return await this.memberSheduleModel.findOne({
                where: {
                    memberId: memberId,
                    personnelServiceId: serviceId,
                    dateStart,
                    dateEnd,
                },
            });
        };
        this.memberSheduleModel = member_schedule_model_1.default;
    }
}
exports.default = MemberSheduleService;
