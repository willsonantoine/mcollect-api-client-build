"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Exercice_comptable_service_1 = __importDefault(require("../services/Exercice.comptable.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
class ExerciceComptableController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { name, observation, date1, date2 } = req.body;
                const exist = await this.exerciceService.findExercice(name);
                if (!exist) {
                    const result = await this.exerciceService.create({
                        date1,
                        date2,
                        name,
                        observation,
                    });
                    (0, response_util_1.setResponse)({ res, data: result });
                }
                else {
                    (0, response_util_1.setResponse)({ res, message: "Cette annee exist", statusCode: 400 });
                }
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
                const result = await this.exerciceService.findAll({ limit, offset });
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.setDefault = async (req, res) => {
            try {
                const id = req.params.id;
                const result = await this.exerciceService.setDefault(id);
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.deleteItem = async (req, res) => {
            try {
                const id = req.params.id;
                const exist = await this.exerciceService.findOne(id);
                if (!(exist === null || exist === void 0 ? void 0 : exist.isDefault)) {
                    const result = await this.exerciceService.deleteExercice(id);
                    (0, response_util_1.setResponse)({ res, data: result });
                }
                else {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Vous ne pouvez pas supprimer une exercice en cours`,
                        statusCode: 400,
                    });
                }
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
        this.exerciceService = new Exercice_comptable_service_1.default();
    }
}
exports.default = new ExerciceComptableController();
