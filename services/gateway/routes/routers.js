"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const settings_router_1 = __importDefault(require("./settings.router"));
const dashboard_router_1 = __importDefault(require("./dashboard.router"));
const RouterGateWay = express_1.default.Router();
RouterGateWay.use("/settings", settings_router_1.default);
RouterGateWay.use("/dashboard", dashboard_router_1.default);
exports.default = RouterGateWay;
