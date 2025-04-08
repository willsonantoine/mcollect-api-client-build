"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const create = [
    (0, express_validator_1.body)("accountFromId")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ accountFromId est obligatoire"),
    (0, express_validator_1.body)("accountToId")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ accountToId est obligatoire"),
    (0, express_validator_1.body)("amount")
        .exists()
        .isNumeric()
        .notEmpty()
        .withMessage("Le champ amount est obligatoire"),
    (0, express_validator_1.body)("amount_in_letter")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ amount_in_letter est obligatoire"),
    (0, express_validator_1.body)("currencyId")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ currencyId est obligatoire"),
    (0, express_validator_1.body)("date_save")
        .exists()
        .isDate()
        .notEmpty()
        .withMessage("Le champ date_save est obligatoire"),
    (0, express_validator_1.body)("memberId")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ memberId est obligatoire"),
    (0, express_validator_1.body)("motif")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ motif est obligatoire"),
    (0, express_validator_1.body)("type")
        .exists()
        .isString()
        .notEmpty()
        .withMessage("Le champ type est obligatoire"),
    (0, express_validator_1.body)("succursaleId")
        .notEmpty()
        .withMessage("Le champ succursale est obligatoire"),
];
exports.default = { create };
