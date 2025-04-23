"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../../shared/utils/response.util");
const members_fonctions_service_1 = __importDefault(require("../services/members.fonctions.service"));
const vars_1 = require("../../../shared/utils/vars");
class MemberFonctionController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const exist = await this.memberFonctionSevice.findByName(req.body.name);
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: 'Cette fonction existe déjà dans le system',
                        statusCode: 400
                    });
                    return;
                }
                const response = await this.memberFonctionSevice.create(req.body);
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
        this.findAll = async (req, res) => {
            try {
                const { limit, offset } = (0, vars_1.pagination)(req);
                const { search } = req.query;
                const response = await this.memberFonctionSevice.findAll({ limit, offset, search: String(search) });
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
        this.update = async (req, res) => {
            try {
                const { id } = req.params;
                const response = await this.memberFonctionSevice.update(id, req.body);
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
        this.delete = async (req, res) => {
            try {
                const { id } = req.params;
                const response = await this.memberFonctionSevice.delete(id);
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
        this.memberFonctionSevice = new members_fonctions_service_1.default();
    }
}
exports.default = new MemberFonctionController();
