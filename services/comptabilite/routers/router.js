"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const execrice_comptable_router_1 = __importDefault(require("./execrice.comptable.router"));
const comptes_router_1 = __importDefault(require("./comptes.router"));
const operations_router_1 = __importDefault(require("./operations.router"));
const billetage_router_1 = __importDefault(require("./billetage.router"));
const credit_router_1 = __importDefault(require("./credit.router"));
const account_mendator_router_1 = __importDefault(require("./account.mendator.router"));
const produit_router_1 = __importDefault(require("./produit.router"));
const ComptabiliteRouter = express_1.default.Router();
ComptabiliteRouter.use("/exercice-comptable", execrice_comptable_router_1.default);
ComptabiliteRouter.use("/comptabilite", comptes_router_1.default);
ComptabiliteRouter.use("/operations", operations_router_1.default);
ComptabiliteRouter.use("/billetage", billetage_router_1.default);
ComptabiliteRouter.use("/credits", credit_router_1.default);
ComptabiliteRouter.use("/mendator", account_mendator_router_1.default);
ComptabiliteRouter.use("/produit", produit_router_1.default);
exports.default = ComptabiliteRouter;
