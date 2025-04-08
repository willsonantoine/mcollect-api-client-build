"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const create = [
    (0, express_validator_1.body)("month").notEmpty().withMessage("Le mois est obligatoire"),
    (0, express_validator_1.body)("rate").notEmpty().withMessage("Le rate est obligatoire"),
    (0, express_validator_1.body)("guarantees").notEmpty().withMessage("La guarantees est obligatoire"),
    (0, express_validator_1.body)("reason").notEmpty().withMessage("Le reason est obligatoire"),
    (0, express_validator_1.body)("startDate").notEmpty().withMessage("La startDate est obligatoire"),
    (0, express_validator_1.body)("endDate").notEmpty().withMessage("La endDate est obligatoire"),
    (0, express_validator_1.body)("createdAt").notEmpty().withMessage("Le Date est obligatoire"),
    (0, express_validator_1.body)("requestedAmount")
        .notEmpty()
        .withMessage("Le requestedAmount est obligatoire"),
    (0, express_validator_1.body)("month").notEmpty().withMessage("Le mois est obligatoire"),
    (0, express_validator_1.body)("month").notEmpty().withMessage("Le mois est obligatoire"),
    (0, express_validator_1.body)("amountInWords").notEmpty().withMessage("Le montant  est"),
    (0, express_validator_1.body)("currencyId").notEmpty().withMessage("La devise ne peut pas etre vide"),
];
exports.default = { create };
