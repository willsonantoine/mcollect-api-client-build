"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const member_presence_model_1 = __importDefault(require("../../../shared/models/member.presence.model"));
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const members_category_model_1 = __importDefault(require("../../../shared/models/members.category.model"));
class MemberPresenceService {
    constructor() {
        this.findAllPresence = async ({ limit, offset, memberId, type, date1, date2, }) => {
            const whereTarger = {};
            if (memberId) {
                whereTarger.memberId = memberId;
            }
            if (type) {
                whereTarger.type = type;
            }
            if (date1 && date2) {
                whereTarger.createdAt = {
                    [sequelize_1.Op.and]: [
                        (0, sequelize_1.literal)(`DATE(MemberPresenceModel.date) >= '${date1}'`),
                        (0, sequelize_1.literal)(`DATE(MemberPresenceModel.date) <= '${date2}'`),
                    ],
                };
            }
            return await this.memberPresenceModel.findAndCountAll({
                where: whereTarger,
                limit,
                offset,
                order: [["date", "desc"]],
                attributes: [
                    "id",
                    "status",
                    "reason",
                    "date",
                    "scanList",
                    "workTimeMunite",
                    "timeIn",
                    "timeOut",
                    "createdAt",
                    "updatedAt",
                ],
                include: {
                    model: members_model_1.default,
                    as: "member",
                    attributes: [
                        "id",
                        "fullname",
                        "number",
                        "gender",
                        "type",
                        "phone",
                        "mail",
                        "adress",
                        "img",
                    ],
                    include: [
                        {
                            model: members_category_model_1.default,
                            as: "fonction",
                            attributes: ["id", "name", "description"],
                        },
                    ],
                },
            });
        };
        this.getTimes = (item) => {
            if (item.length > 0) {
                if (item.length > 0 && item.length == 1) {
                    return { in: item[0], out: "" };
                }
                else if (item.length > 0 && item.length === 2) {
                    return { in: item[0], out: item[1] };
                }
                else if (item.length > 0 && item.length > 2) {
                    return { in: item[0], out: item[item.length - 1] };
                }
            }
            return { in: "", out: "" };
        };
        this.memberPresenceModel = member_presence_model_1.default;
    }
    async createMemberPresence(memberPresenceData) {
        return await this.memberPresenceModel.create(memberPresenceData);
    }
    async getMemberPresenceById(id) {
        return await this.memberPresenceModel.findByPk(id);
    }
    async findPresenceByMemberIdAndByDate(memberId, date) {
        return await this.memberPresenceModel.findOne({
            where: {
                memberId,
                date,
            },
        });
    }
}
exports.default = MemberPresenceService;
