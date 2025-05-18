"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const member_shedule_controller_1 = __importDefault(require("../controllers/member.shedule.controller"));
const authToken_1 = require("../../../shared/middleware/authToken");
const MemberSheduleRouter = express_1.default.Router();
MemberSheduleRouter.post("/create", member_shedule_controller_1.default.create);
MemberSheduleRouter.put("/update/:id", member_shedule_controller_1.default.update);
MemberSheduleRouter.delete("/delete/:id", member_shedule_controller_1.default.delete);
MemberSheduleRouter.get("/get", member_shedule_controller_1.default.findAll);
MemberSheduleRouter.get("/get/:id", member_shedule_controller_1.default.findById);
// Free days
MemberSheduleRouter.post("/freedays/create", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), member_shedule_controller_1.default.createFreeDays);
MemberSheduleRouter.put("/freedays/update/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), member_shedule_controller_1.default.createFreeDays);
MemberSheduleRouter.get("/freedays/get", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), member_shedule_controller_1.default.findAllFreeDays);
MemberSheduleRouter.delete("/freedays/delete/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), member_shedule_controller_1.default.deleteFreeDays);
exports.default = MemberSheduleRouter;
