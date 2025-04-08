"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const exerciceComptableValidator = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
    (0, express_validator_1.body)("observation")
        .optional()
        .isString()
        .withMessage("Observation must be a string"),
    (0, express_validator_1.body)("date1")
        .notEmpty()
        .withMessage("Date1 is required")
        .isISO8601()
        .withMessage("Date1 must be a valid date"),
    (0, express_validator_1.body)("date2")
        .notEmpty()
        .withMessage("Date2 is required")
        .isISO8601()
        .withMessage("Date2 must be a valid date"),
];
exports.default = { exerciceComptableValidator };
