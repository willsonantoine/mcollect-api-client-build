"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const operations_controller_1 = __importDefault(require("../controllers/operations.controller"));
const vars_1 = require("../../../shared/utils/vars");
const operations_validator_1 = __importDefault(require("../validator/operations.validator"));
const authToken_1 = require("../../../shared/middleware/authToken");
const OperationsRouter = express_1.default.Router();
OperationsRouter.post("/create", (0, vars_1.Validate)(operations_validator_1.default.create), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), operations_controller_1.default.create);
OperationsRouter.put("/validate/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), operations_controller_1.default.ValidateOperation);
exports.default = OperationsRouter;
