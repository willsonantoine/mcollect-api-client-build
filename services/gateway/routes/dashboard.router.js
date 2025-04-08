"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authToken_1 = require("../../../shared/middleware/authToken");
const dashboard_controller_1 = __importDefault(require("../controllers/dashboard.controller"));
const DashboardRouter = express_1.default.Router();
DashboardRouter.get("/home", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), dashboard_controller_1.default.getDashboard);
exports.default = DashboardRouter;
