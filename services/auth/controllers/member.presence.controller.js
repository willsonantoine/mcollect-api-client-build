"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const member_presence_service_1 = __importDefault(require("../services/member.presence.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const members_service_1 = __importDefault(require("../services/members.service"));
const vars_1 = require("../../../shared/utils/vars");
class MemberPresenceController {
    constructor() {
        this.createPresences = async (req, res) => {
            var _a;
            try {
                const { idAgent, nameAgent, date, status, reason, times } = req.body;
                const memberId = await this.memberService.getMemberId(idAgent, nameAgent);
                const exist = await this.memberPresenceService.findPresenceByMemberIdAndByDate(memberId, date);
                if (!exist) {
                    const timeIn = this.memberPresenceService.getTimes(times).in;
                    const timeOut = this.memberPresenceService.getTimes(times).out;
                    const workTimeMunite = (_a = (0, vars_1.getHoursAndMinutesBetweenTimes)(timeIn, timeOut)) === null || _a === void 0 ? void 0 : _a.formatted;
                    const newMemberPresence = await this.memberPresenceService.createMemberPresence({
                        memberId,
                        date,
                        status,
                        scanList: times,
                        timeIn: timeIn,
                        timeOut: timeOut,
                        workTimeMunite,
                        reason,
                    });
                    console.log("Presence created !!", newMemberPresence.memberId);
                }
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 200,
                    message: "Member presence created successfully",
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: "Error creating member presence",
                    error: error,
                });
            }
        };
        this.findAllPresence = async (req, res) => {
            try {
                const { limit, offset } = (0, vars_1.pagination)(req);
                const { memberId, type, date1, date2 } = req.query;
                const response = await this.memberPresenceService.findAllPresence({
                    limit,
                    offset,
                    memberId: String(memberId),
                    type: String(type),
                    date1: String(date1),
                    date2: String(date2),
                });
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: "Error getting member presence",
                    error: error.message,
                });
            }
        };
        this.memberPresenceService = new member_presence_service_1.default();
        this.memberService = new members_service_1.default();
    }
}
exports.default = new MemberPresenceController();
