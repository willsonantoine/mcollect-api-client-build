"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const member_shedule_service_1 = __importDefault(require("../services/member.shedule.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
class MemberSheduleController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { memberId, personnelServiceId, dateStart, dateEnd, status, observation, description, notification, diplicate, acceptLateMunite, } = req.body;
                const find = await this.memberSheduleService.findScheduleByMemberId(memberId, personnelServiceId, dateStart, dateEnd);
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
                    personnelServiceId: personnelServiceId,
                    dateStart,
                    dateEnd,
                    status,
                    observation,
                    description,
                    notification,
                    diplicate,
                    acceptLateMunite,
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
                const { limit, offset } = (0, vars_1.pagination)(req);
                const { memberId, dateStart, dateEnd, serviceId } = req.query;
                const response = await this.memberSheduleService.findAll({
                    offset,
                    limit,
                    memberId: String(memberId),
                    dateEnd: String(dateEnd),
                    dateStart: String(dateStart),
                    serviceId: String(serviceId),
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
                const { memberId, personnelServiceId, dateStart, dateEnd, status, observation, description, notification, diplicate, acceptLateMunite, } = req.body;
                const response = await this.memberSheduleService.update(id, {
                    memberId,
                    personnelServiceId: personnelServiceId,
                    dateStart,
                    dateEnd,
                    status,
                    observation,
                    description,
                    notification,
                    diplicate,
                    acceptLateMunite,
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
        // Shedule free days
        this.createFreeDays = async (req, res) => {
            try {
                const { name, date, description } = req.body;
                const userCreatedId = req.user.id;
                const find = await this.memberSheduleService.findFreeDays(date);
                if (find) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Cette date existe déja dans le system`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.memberSheduleService.createFreeDays({
                    date,
                    name,
                    description,
                    userCreatedId,
                });
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.updateFreeDays = async (req, res) => {
            try {
                const { name, date, description } = req.body;
                const userUpdatedId = req.user.id;
                const id = req.params.id;
                const find = await this.memberSheduleService.findFreeDaysByPk(id);
                if (!find) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Cette date n'existe pas dans le system`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.memberSheduleService.updateFreeDays(id, {
                    date,
                    name,
                    description,
                    userUpdatedId,
                });
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.deleteFreeDays = async (req, res) => {
            try {
                const id = req.params.id;
                const find = await this.memberSheduleService.findFreeDaysByPk(id);
                if (!find) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Cette date n'existe pas dans le system`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.memberSheduleService.deleteFreeDays(id);
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.findAllFreeDays = async (req, res) => {
            const { search } = req.query;
            try {
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.memberSheduleService.findAllFreeDays({
                    search: String(search),
                    limit,
                    offset,
                });
                (0, response_util_1.setResponse)({ res, data: result });
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
