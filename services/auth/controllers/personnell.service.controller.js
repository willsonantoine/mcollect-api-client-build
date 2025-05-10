"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const personnel_services_service_1 = __importDefault(require("../services/personnel.services.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
class PersonnellServiceController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { name, description } = req.body;
                const exist = await this.personnelleService.findByName(name);
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce service exist déja dans le system`,
                        statusCode: 400,
                    });
                    return;
                }
                const service = await this.personnelleService.create({
                    name,
                    description,
                });
                (0, response_util_1.setResponse)({
                    res,
                    message: "Service crée avec succès",
                    data: service,
                    statusCode: 201,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                });
            }
        };
        this.update = async (req, res) => {
            try {
                const { name, description } = req.body;
                const id = req.params.id;
                const exist = await this.personnelleService.findOne(id);
                if (!exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce service n'existe pas dans le system`,
                        statusCode: 400,
                    });
                    return;
                }
                const service = await this.personnelleService.update(id, {
                    name,
                    description,
                });
                (0, response_util_1.setResponse)({
                    res,
                    message: "Service mise en jour avec succès",
                    data: service,
                    statusCode: 201,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                });
            }
        };
        this.findAll = async (req, res) => {
            try {
                const { search } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const service = await this.personnelleService.findAll({
                    limit,
                    offset,
                    search: String(search),
                });
                (0, response_util_1.setResponse)({
                    res,
                    message: "Service crée avec succès",
                    data: service,
                    statusCode: 201,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                });
            }
        };
        this.delete = async (req, res) => {
            try {
                const id = req.params.id;
                const exist = await this.personnelleService.findOne(id);
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce service exist déja dans le system`,
                        statusCode: 400,
                    });
                    return;
                }
                const service = await this.personnelleService.delete(id);
                (0, response_util_1.setResponse)({
                    res,
                    message: "Service supprimé avec succès",
                    data: service,
                    statusCode: 201,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                });
            }
        };
        this.personnelleService = new personnel_services_service_1.default();
    }
}
exports.default = new PersonnellServiceController();
