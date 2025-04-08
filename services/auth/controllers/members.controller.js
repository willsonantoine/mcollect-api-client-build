"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const members_service_1 = __importDefault(require("../services/members.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
const comptes_service_1 = __importDefault(require("../../comptabilite/services/comptes.service"));
const settings_service_1 = __importDefault(require("../../gateway/services/settings.service"));
const users_service_1 = __importDefault(require("../services/users.service"));
class MembersController {
    constructor() {
        this.findAll = async (req, res) => {
            try {
                const { date1, date2, search, gender = "", type = "" } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const response = await this.memberService.findAll({
                    search,
                    limit,
                    offset,
                    gender,
                    type,
                    date2,
                    date1,
                });
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.create = async (req, res) => {
            try {
                const data = req.body;
                const number = data.number;
                const existNumber = await this.memberService.findByNumber(number);
                if (existNumber) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: "Ce matricule existe déjà dans le system",
                        statusCode: 400,
                    }); // Le numéro existe déjà
                    return;
                }
                const entreprise = await this.settingsService.getEntrepriseInformations();
                if (entreprise && !entreprise.memberAcountClassId) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: "Veuillez renseigner le compteur des comptes associé à l'entreprise",
                        statusCode: 400,
                    });
                    return;
                }
                const member = await this.memberService.create(data);
                if (member) {
                    if (data.accountNumber && data.accountName) {
                        console.log(`Current Class ID :: `, entreprise === null || entreprise === void 0 ? void 0 : entreprise.memberAcountClassId);
                        const compte = await this.compteService.createAccount({
                            memberId: member.id,
                            number: data.accountNumber,
                            name: data.accountName,
                            description: data.accountDescription,
                            classId: entreprise === null || entreprise === void 0 ? void 0 : entreprise.memberAcountClassId,
                        });
                        compte && console.log(`Account is Created :: ${compte.name}`);
                    }
                }
                (0, response_util_1.setResponse)({ res });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.update = async (req, res) => {
            try {
                const id = req.params.id;
                const data = req.body;
                const userId = req.user.id;
                const response = await this.memberService.update(id, Object.assign(Object.assign({}, data), { updatedAt: new Date(), userUpdatedId: userId }));
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findMemberFonction = async (req, res) => {
            try {
                const data = req.body;
                const response = await this.memberService.getFonctions();
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findMemberCilvilStatus = async (req, res) => {
            try {
                const response = this.memberService.getCivilStatus();
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findMemberType = async (req, res) => {
            try {
                const response = this.memberService.getMembersType();
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findMemberGenders = async (req, res) => {
            try {
                const response = this.memberService.getGenders();
                (0, response_util_1.setResponse)({ res, data: response });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.deleteMember = async (req, res) => {
            try {
                const user = req.user;
                const { id } = req.params;
                const response = await this.memberService.deleteMember(id, user.id);
                (0, response_util_1.setResponse)({
                    res,
                    data: response,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getAllGenders = async (req, res) => {
            try {
                const response = await this.memberService.getAllGenders();
                (0, response_util_1.setResponse)({
                    res,
                    data: response,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getMemberStatistics = async (req, res) => {
            try {
                const { date1, date2, type = "" } = req.query;
                const response = await this.memberService.Statistics({
                    date1,
                    date2,
                    type,
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: response,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getNextNumberMember = async (req, res) => {
            try {
                const entrep = await this.settingsService.getEntrepriseInformations();
                const count = await this.memberService.getNextNumber();
                (0, response_util_1.setResponse)({
                    res,
                    data: `${entrep === null || entrep === void 0 ? void 0 : entrep.prefixMatriculeMembers}${count}`,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.memberService = new members_service_1.default();
        this.compteService = new comptes_service_1.default();
        this.settingsService = new settings_service_1.default();
        this.userService = new users_service_1.default();
    }
}
exports.default = new MembersController();
