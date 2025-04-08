"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const send = [
    (0, express_validator_1.body)("message").notEmpty().withMessage("Le message est obligatoire"),
    (0, express_validator_1.body)("phone").notEmpty().withMessage("Le phone est obligatoire"),
];
exports.default = { send };
