"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const member_shedule_controller_1 = __importDefault(require("../controllers/member.shedule.controller"));
const MemberSheduleRouter = express_1.default.Router();
MemberSheduleRouter.post("/create", member_shedule_controller_1.default.create);
MemberSheduleRouter.put("/update", member_shedule_controller_1.default.update);
MemberSheduleRouter.delete("/delete/:id", member_shedule_controller_1.default.delete);
MemberSheduleRouter.get("/get", member_shedule_controller_1.default.findAll);
MemberSheduleRouter.get("/get/:id", member_shedule_controller_1.default.findById);
exports.default = MemberSheduleRouter;
