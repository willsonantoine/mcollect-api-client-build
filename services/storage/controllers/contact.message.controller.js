"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contact_message_service_1 = __importDefault(require("../services/contact.message.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
const web_service_1 = __importDefault(require("../services/web.service"));
class ContactMessageController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { token } = req.params;
                const web = await this.webSiteService.SiteFindByToken(token);
                if (!web) {
                    (0, response_util_1.setResponse)({ res, message: 'Site web non trouvé', statusCode: 400 });
                    return;
                }
                const result = await this.contactMessageService.create(Object.assign(Object.assign({}, req.body), { siteId: web.id }));
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: `Une erreur interne s'est produite`,
                    error,
                });
            }
        };
        this.findAll = async (req, res) => {
            try {
                const { search } = req.query;
                const { siteId } = req.params;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.contactMessageService.findAll({ limit, offset, search: String(search), siteId });
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    message: `Une erreur interne s'est produite`,
                    error,
                });
            }
        };
        this.contactMessageService = new contact_message_service_1.default();
        this.webSiteService = new web_service_1.default();
    }
}
exports.default = new ContactMessageController();
