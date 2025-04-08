"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_service_1 = __importDefault(require("../services/web.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
class WebController {
    constructor() {
        this.SiteCreate = async (req, res) => {
            try {
                const userCreatedId = req.user.id;
                const exist = await this.webService.SiteFindByName(req.body.name);
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Un site web avec ce meme nom existe deja`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteCreate(Object.assign(Object.assign({}, req.body), { userCreatedId }));
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
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
        this.SiteUpdate = async (req, res) => {
            try {
                const id = req.params.id;
                const exist = await this.webService.SiteFindOne(id);
                if (!exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce site web n'existe pas`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteUpdate(id, req.body);
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                });
            }
        };
        this.SiteDelelte = async (req, res) => {
            try {
                const id = req.params.id;
                const exist = await this.webService.SiteFindOne(id);
                if (!exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce site web n'existe pas`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteDelete(id);
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                });
            }
        };
        this.SiteFindAll = async (req, res) => {
            try {
                const { search } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.webService.SiteFindAll({
                    limit,
                    offset,
                    search: String(search),
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                });
            }
        };
        this.SiteContaintCreate = async (req, res) => {
            try {
                const userCreatedId = req.user.id;
                const type = req.body.type;
                const exist = await this.webService.SiteContaintFindTitle({ title: req.body.title, type });
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Un site web avec ce meme nom existe deja`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteContaintCreate(Object.assign(Object.assign({}, req.body), { userCreatedId }));
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
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
        this.SiteContaintUpdate = async (req, res) => {
            try {
                const id = req.params.id;
                const exist = await this.webService.SiteContaintFindOne({
                    id: String(id),
                });
                if (!exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce site web n'existe pas`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteContaintUpdate(id, req.body);
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.SiteContaintDelelte = async (req, res) => {
            try {
                const id = req.params.id;
                const exist = await this.webService.SiteContaintFindOne({
                    id: String(id),
                });
                if (!exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce site web n'existe pas`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteContaintDelete(id);
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                });
            }
        };
        this.SiteContaintFindAll = async (req, res) => {
            try {
                const { search, type, siteId } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.webService.SiteContaintFindAll({
                    limit,
                    offset,
                    search: String(search),
                    type: String(type),
                    siteId: String(siteId),
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        // Containt catégorie
        this.SiteContaintCategoryCreate = async (req, res) => {
            try {
                const userCreatedId = req.user.id;
                const exist = await this.webService.SiteContaintCategoryFindByName(req.body.name);
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Une catégorie avec ce meme nom existe deja`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteContaintCategoryCreate(Object.assign(Object.assign({}, req.body), { userCreatedId }));
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
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
        this.SiteContaintCategoryUpdate = async (req, res) => {
            try {
                const id = req.params.id;
                const exist = await this.webService.SiteContaintCategoryFindOne(String(id));
                if (!exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Cette catégorie n'existe pas`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteContaintCategoryUpdate(id, req.body);
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.SiteContaintCategoryDelelte = async (req, res) => {
            try {
                const id = req.params.id;
                const exist = await this.webService.SiteContaintCategoryFindOne(String(id));
                if (!exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce site web n'existe pas`,
                        statusCode: 400,
                    });
                    return;
                }
                const result = await this.webService.SiteContaintCategoryDelete(id);
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                });
            }
        };
        this.SiteContaintCategoryFindAll = async (req, res) => {
            try {
                const { search, type, siteId } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.webService.SiteContaintCategoryFindAll({
                    limit,
                    offset,
                    search: String(search),
                    siteId: String(siteId),
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getDashboardData = async (req, res) => {
            try {
                const currentYear = parseInt(req.query.year, 10) || new Date().getFullYear(); // Get year from query params, default to current year
                const type = req.query.type || "year"; // Get type from query params, default to 'year'
                const dashboardData = await this.webService.SiteDashboard({
                    currentYear,
                    type,
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: dashboardData,
                });
            }
            catch (error) {
                // Capture error
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.getVisite = async (req, res) => {
            try {
                const siteId = req.params.siteId;
                const dashboardData = await this.webService.getVisites({ siteId });
                (0, response_util_1.setResponse)({
                    res,
                    data: dashboardData,
                });
            }
            catch (error) {
                // Capture error
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.webService = new web_service_1.default();
    }
}
exports.default = new WebController();
