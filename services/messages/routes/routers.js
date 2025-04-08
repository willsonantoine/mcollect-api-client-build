"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const message_controller_1 = __importDefault(require("../controllers/message.controller"));
const authToken_1 = require("../../../shared/middleware/authToken");
const vars_1 = require("../../../shared/utils/vars");
const message_validator_1 = __importDefault(require("./message.validator"));
const RouterMessage = express_1.default.Router();
RouterMessage.post("/send", (0, vars_1.Validate)(message_validator_1.default.send), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), message_controller_1.default.send);
RouterMessage.put("/resend/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), message_controller_1.default.resend);
RouterMessage.get("/load", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), message_controller_1.default.findAll);
exports.default = RouterMessage;
