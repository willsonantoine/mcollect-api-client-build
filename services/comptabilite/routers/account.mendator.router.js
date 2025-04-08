"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_mandator_controller_1 = __importDefault(require("../controllers/account.mandator.controller"));
const vars_1 = require("../../../shared/utils/vars");
const account_mandator_validator_1 = __importDefault(require("../validator/account.mandator.validator"));
const authToken_1 = require("../../../shared/middleware/authToken");
const AccountMendatorRouter = express_1.default.Router();
AccountMendatorRouter.post("/create", (0, vars_1.Validate)(account_mandator_validator_1.default.create), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), account_mandator_controller_1.default.create);
AccountMendatorRouter.put("/update/:id", (0, vars_1.Validate)(account_mandator_validator_1.default.create), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), account_mandator_controller_1.default.update);
AccountMendatorRouter.delete("/delete/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), account_mandator_controller_1.default.deleteItem);
AccountMendatorRouter.get("/load/:accountId", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), account_mandator_controller_1.default.findAll);
exports.default = AccountMendatorRouter;
