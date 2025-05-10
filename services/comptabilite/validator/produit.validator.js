"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const CreateProduitValidator = [
    (0, express_validator_1.body)("name")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ name est obligatoire"),
    (0, express_validator_1.body)("qte")
        .exists()
        .isNumeric()
        .notEmpty()
        .withMessage("Le champ qte est obligatoire"),
    (0, express_validator_1.body)("qte_min")
        .exists()
        .isNumeric()
        .notEmpty()
        .withMessage("Le champ qte_min est obligatoire"),
    (0, express_validator_1.body)("description")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ description est obligatoire"),
    (0, express_validator_1.body)("price_min")
        .exists()
        .isNumeric()
        .notEmpty()
        .withMessage("Le champ price_min est obligatoire"),
    (0, express_validator_1.body)("price_max")
        .exists()
        .isNumeric()
        .notEmpty()
        .withMessage("Le champ price_max est obligatoire"),
    (0, express_validator_1.body)("currencyId")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ currencyId est obligatoire"),
    (0, express_validator_1.body)("type")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ type est obligatoire"),
    (0, express_validator_1.body)("subCategoryId")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ subCategoryId est obligatoire"),
    (0, express_validator_1.body)("currencyId")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ subCategoryId est obligatoire"),
];
const CreateProduitCategoryValidator = [
    (0, express_validator_1.body)("name")
        .optional()
        .isString()
        .withMessage("Le champ name doit être une chaîne de caractères"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Le champ description doit être une chaîne de caractères"),
    (0, express_validator_1.body)("createdAt")
        .optional()
        .isISO8601()
        .withMessage("Le champ createdAt doit être une date valide"),
    (0, express_validator_1.body)("updatedAt")
        .optional()
        .isISO8601()
        .withMessage("Le champ updatedAt doit être une date valide"),
    (0, express_validator_1.body)("image")
        .optional()
        .isString()
        .withMessage("Le champ image doit être une chaîne de caractères"),
];
const CreateSubProduitCategoryValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .isString()
        .withMessage("Le champ name doit être une chaîne de caractères"),
    (0, express_validator_1.body)("description")
        .optional()
        .isString()
        .withMessage("Le champ description doit être une chaîne de caractères"),
    (0, express_validator_1.body)("image")
        .optional()
        .isString()
        .withMessage("Le champ image doit être une chaîne de caractères"),
    (0, express_validator_1.body)("categoryId")
        .notEmpty()
        .isString()
        .withMessage("Le champ categoryId doit être une chaîne de caractères"),
];
exports.default = {
    CreateProduitValidator,
    CreateProduitCategoryValidator,
    CreateSubProduitCategoryValidator,
};
