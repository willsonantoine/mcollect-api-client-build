"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billetage_controller_1 = __importDefault(require("../controllers/billetage.controller"));
const authToken_1 = require("../../../shared/middleware/authToken");
const BilletageRouter = (0, express_1.default)();
BilletageRouter.get("/find-all", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), billetage_controller_1.default.findAll);
BilletageRouter.get("/find-history", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), billetage_controller_1.default.getBilletageHistory);
BilletageRouter.get("/find-by-operation/:operationId", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), billetage_controller_1.default.getBilletageByOperationId);
BilletageRouter.get("/findBilletage", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), billetage_controller_1.default.getBilletage);
BilletageRouter.put("/update/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), billetage_controller_1.default.updateBilletage);
exports.default = BilletageRouter;
