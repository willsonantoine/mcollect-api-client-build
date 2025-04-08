"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const synchro_controller_1 = __importDefault(require("../controllers/synchro.controller"));
const synchro_auth_1 = require("../../../shared/middleware/synchro.auth");
const SynchroRouter = express_1.default.Router();
SynchroRouter.post("/members", synchro_auth_1.AuthSynchro, synchro_controller_1.default.members);
SynchroRouter.post("/stock", synchro_auth_1.AuthSynchro, synchro_controller_1.default.stock);
SynchroRouter.post("/operations", synchro_auth_1.AuthSynchro, synchro_controller_1.default.operations);
exports.default = SynchroRouter;
