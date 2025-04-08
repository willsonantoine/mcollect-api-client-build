"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const create = [(0, express_validator_1.body)("code").isString().isLength({ min: 1, max: 10 })];
const updateAccount = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Required"),
    (0, express_validator_1.body)("description").notEmpty().withMessage("Required"),
    (0, express_validator_1.body)("number").notEmpty().withMessage("Required"),
    (0, express_validator_1.body)("isPeriodique")
        .notEmpty()
        .withMessage("Required")
        .isBoolean()
        .withMessage("Boolean only required"),
    (0, express_validator_1.body)("classId").notEmpty().withMessage("Required"),
];
exports.default = { create, updateAccount };
