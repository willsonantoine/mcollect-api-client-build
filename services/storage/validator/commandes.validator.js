"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const commandesValidator = [
    (0, express_validator_1.body)("payementMethod") // Corrected typo: methodPayement -> payementMethod
        .notEmpty()
        .withMessage("Le mode de paiement est requis")
        .isIn(["mobile", "visa_card", "banck_card"])
        .withMessage("Le mode de paiement doit être 'mobile', 'visa_card' ou 'banck_card'"),
    (0, express_validator_1.body)("phoneNumber")
        .notEmpty()
        .withMessage("Le numéro de téléphone est requis")
        .isString()
        .withMessage("Le numéro de téléphone doit être une chaîne de caractères"),
    (0, express_validator_1.body)("lines")
        .notEmpty()
        .withMessage("Les lignes de commande sont requises")
        .isArray()
        .withMessage("Les lignes de commande doivent être un tableau")
        .custom((lines) => {
        console.log(lines);
        return lines.every((line) => typeof line.productId === "string" &&
            typeof line.quantity === "number");
    })
        .withMessage("Chaque ligne de commande doit avoir 'produitId' (UUID string) et 'quantity' (number)"),
];
exports.default = { commandesValidator };
