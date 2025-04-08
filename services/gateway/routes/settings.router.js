"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settings_controller_1 = __importDefault(require("../controllers/settings.controller"));
const authToken_1 = require("../../../shared/middleware/authToken");
const SettingsRouter = express_1.default.Router();
SettingsRouter.get("/make-correction-to-structure", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), settings_controller_1.default.makeCorrectionToModal);
SettingsRouter.post("/entreprise/update", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), settings_controller_1.default.changeEntreprseInformations);
SettingsRouter.get("/entreprise/load", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), settings_controller_1.default.getEntrepriseInformations);
SettingsRouter.get("/succursale", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), settings_controller_1.default.getSuccursale);
exports.default = SettingsRouter;
