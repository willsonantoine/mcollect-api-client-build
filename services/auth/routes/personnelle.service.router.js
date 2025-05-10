"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const personnell_service_controller_1 = __importDefault(require("../controllers/personnell.service.controller"));
const PersonnelleServiceRouter = express_1.default.Router();
PersonnelleServiceRouter.post("/create", personnell_service_controller_1.default.create);
PersonnelleServiceRouter.put("/update/:id", personnell_service_controller_1.default.update);
PersonnelleServiceRouter.get("/find", personnell_service_controller_1.default.findAll);
PersonnelleServiceRouter.delete("/delete/:id", personnell_service_controller_1.default.delete);
exports.default = PersonnelleServiceRouter;
