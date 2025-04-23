"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const produit_controller_1 = __importDefault(require("../controllers/produit.controller"));
const vars_1 = require("../../../shared/utils/vars");
const produit_validator_1 = __importDefault(require("../validator/produit.validator"));
const authToken_1 = require("../../../shared/middleware/authToken");
const ProduitRouter = express_1.default.Router();
// Produit
ProduitRouter.post("/prod", (0, vars_1.Validate)(produit_validator_1.default.CreateProduitValidator), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.createProduit);
ProduitRouter.get("/prod/", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.loadProduit);
ProduitRouter.put("/prod/:id", (0, vars_1.Validate)(produit_validator_1.default.CreateProduitValidator), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.updateProduit);
ProduitRouter.delete("/prod/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.deleteProduit);
// Category
ProduitRouter.post("/categ", (0, vars_1.Validate)(produit_validator_1.default.CreateProduitCategoryValidator), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.createCategoryProduit);
ProduitRouter.get("/categ/", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.loadCategoryProduit);
ProduitRouter.put("/categ/:id", (0, vars_1.Validate)(produit_validator_1.default.CreateProduitCategoryValidator), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.updateCategoryProduit);
ProduitRouter.delete("/categ/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.deleteCategoryProduit);
// Sub Category
ProduitRouter.post("/sub-categ", (0, vars_1.Validate)(produit_validator_1.default.CreateSubProduitCategoryValidator), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.createSubCategoryProduit);
ProduitRouter.get("/sub-categ/", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.loadSubCategoryProduit);
ProduitRouter.put("/sub-categ/:id", (0, vars_1.Validate)(produit_validator_1.default.CreateSubProduitCategoryValidator), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.updateSubCategoryProduit);
ProduitRouter.delete("/sub-categ/:id", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.Admin, authToken_1.EnumRoles.SuperAdmin]), produit_controller_1.default.deleteSubCategoryProduit);
exports.default = ProduitRouter;
