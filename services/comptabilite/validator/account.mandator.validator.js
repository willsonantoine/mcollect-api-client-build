"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const create = [
    (0, express_validator_1.body)("accountId").notEmpty().withMessage("Le compte est obligatoire"),
    (0, express_validator_1.body)("memberId").notEmpty().withMessage("Le membre est obligatoire"),
    (0, express_validator_1.body)("type").notEmpty().withMessage("Le type est obligatoire"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("La description est obligatoire"),
];
exports.default = { create };
