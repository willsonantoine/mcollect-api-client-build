"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vars_1 = require("../../../shared/utils/vars");
const exercice_comptable_validator_1 = __importDefault(require("../validator/exercice.comptable.validator"));
const execrice_comptable_controller_1 = __importDefault(require("../controllers/execrice.comptable.controller"));
const authToken_1 = require("../../../shared/middleware/authToken");
const ExerciceComptableRouter = express_1.default.Router();
ExerciceComptableRouter.post("/create", (0, vars_1.Validate)(exercice_comptable_validator_1.default.exerciceComptableValidator), execrice_comptable_controller_1.default.create);
ExerciceComptableRouter.get("/load", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), execrice_comptable_controller_1.default.findAll);
ExerciceComptableRouter.put("/set-default/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), execrice_comptable_controller_1.default.setDefault);
ExerciceComptableRouter.delete("/delete/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), execrice_comptable_controller_1.default.deleteItem);
exports.default = ExerciceComptableRouter;
