"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const report = require("../services/print.service");
const vars_1 = require("../../../shared/utils/vars");
const settings_service_1 = __importDefault(require("../../gateway/services/settings.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const members_service_1 = __importDefault(require("../../auth/services/members.service"));
class PrintController {
    constructor() {
        this.generateMembersList = async (req, res) => {
            try {
                const { date1, date2, search, gender = "", type = "" } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const { rows, count } = await this.memberService.findAll({
                    search,
                    limit,
                    offset,
                    gender,
                    type,
                    date2,
                    date1,
                });
                const entreprise = await this.settingsService.getEntrepriseInformations();
                if (entreprise) {
                    const columnDefinitions = [
                        {
                            header: "number",
                            dataKey: "number",
                            dataType: "string",
                            widthPercentage: 10,
                        },
                        {
                            header: "Date d'adhesion",
                            dataKey: "joinedAt",
                            dataType: "date",
                            widthPercentage: 15,
                            formatter: (date) => (0, vars_1.formatDateString)(date),
                        },
                        {
                            header: "Nom complet",
                            dataKey: "fullname",
                            dataType: "string",
                            widthPercentage: 25,
                        },
                        {
                            header: "Genre",
                            dataKey: "gender",
                            dataType: "string",
                            widthPercentage: 10,
                        },
                        {
                            header: "adresse",
                            dataKey: "adress",
                            dataType: "string",
                            widthPercentage: 20,
                        },
                        {
                            header: "N° Carte d'indentité",
                            dataKey: "id_national_card",
                            dataType: "string",
                            widthPercentage: 20,
                        },
                    ];
                    const pdfDataUri = report.generateDynamicReport(entreprise, "Liste des Membres", columnDefinitions, rows, "l");
                    (0, response_util_1.setResponse)({ res, data: pdfDataUri });
                    return;
                }
                (0, response_util_1.setResponse)({ res, statusCode: 400, message: "Erreur de configuration" });
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
        this.settingsService = new settings_service_1.default();
        this.memberService = new members_service_1.default();
    }
}
exports.default = new PrintController();
