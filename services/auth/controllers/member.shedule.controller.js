"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const member_shedule_service_1 = __importDefault(require("../services/member.shedule.service"));
const response_util_1 = require("../../../shared/utils/response.util");
class MemberSheduleController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { memberId, serviceId, startDate, endDate, status, observation, description, } = req.body;
                const find = await this.memberSheduleService.findScheduleByMemberId(memberId, serviceId);
                if (find) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Un calendrier pour cet agent existe déja`,
                        statusCode: 400,
                    });
                    return;
                }
                const response = await this.memberSheduleService.create({
                    memberId,
                    personnelServiceId: serviceId,
                    dateStart: startDate,
                    dateEnd: endDate,
                    status,
                    observation,
                    description,
                });
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: error.message,
                    error,
                });
            }
        };
        this.findAll = async (req, res) => {
            try {
                const response = await this.memberSheduleService.findAll();
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: error.message,
                    error,
                });
            }
        };
        this.findById = async (req, res) => {
            try {
                const id = req.params.id;
                const response = await this.memberSheduleService.findById(id);
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: "Une erreur interne s'est produite",
                    error,
                });
            }
        };
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                const { memberId, serviceId, startDate, endDate, status, observation, description, } = req.body;
                const response = await this.memberSheduleService.update(id, {
                    memberId,
                    personnelServiceId: serviceId,
                    dateStart: startDate,
                    dateEnd: endDate,
                    status,
                    observation,
                    description,
                });
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: error.message,
                    error,
                });
            }
        };
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                const response = await this.memberSheduleService.delete(id);
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: error.message,
                    error,
                });
            }
        };
        this.memberSheduleService = new member_shedule_service_1.default();
    }
}
exports.default = new MemberSheduleController();
