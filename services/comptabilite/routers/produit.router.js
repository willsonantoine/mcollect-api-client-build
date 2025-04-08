"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produit_controller_1 = __importDefault(require("../controllers/produit.controller"));
const ProduitRouter = express_1.default.Router();
ProduitRouter.post("/create", produit_controller_1.default.createProduit);
ProduitRouter.get("/", produit_controller_1.default.loadProduit);
exports.default = ProduitRouter;
