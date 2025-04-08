"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const web_controller_1 = __importDefault(require("../controllers/web.controller"));
const authToken_1 = require("../../../shared/middleware/authToken");
const WebRouter = express_1.default.Router();
WebRouter.post("/site/create", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteCreate);
WebRouter.get("/site/find", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteFindAll);
WebRouter.put("/site/update/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteUpdate);
WebRouter.delete("/site/delete/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteDelelte);
// Containt
WebRouter.post("/containt/create", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteContaintCreate);
WebRouter.get("/containt/find", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteContaintFindAll);
WebRouter.put("/containt/update/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteContaintUpdate);
WebRouter.delete("/containt/delete/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteContaintDelelte);
// Containt Categorie
WebRouter.post("/containt/category/create", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteContaintCategoryCreate);
WebRouter.get("/containt/category/find", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteContaintCategoryFindAll);
WebRouter.put("/containt/category/update/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteContaintCategoryUpdate);
WebRouter.delete("/containt/category/delete/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.SiteContaintCategoryDelelte);
WebRouter.get("/dashboard", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.getDashboardData);
WebRouter.get("/visite/:siteId", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), web_controller_1.default.getVisite);
exports.default = WebRouter;
