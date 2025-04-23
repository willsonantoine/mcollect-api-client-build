"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produit_router_1 = __importDefault(require("../comptabilite/routers/produit.router"));
const routers_1 = __importDefault(require("../auth/routes/routers"));
const router_1 = __importDefault(require("../comptabilite/routers/router"));
const router_2 = __importDefault(require("../storage/routes/router"));
const routers_2 = __importDefault(require("../messages/routes/routers"));
const RouterInit = express_1.default.Router();
RouterInit.use(produit_router_1.default);
RouterInit.use(routers_1.default);
RouterInit.use(router_1.default);
RouterInit.use(router_2.default);
RouterInit.use(routers_2.default);
exports.default = RouterInit;
