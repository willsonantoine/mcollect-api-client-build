"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const login = [
    (0, express_validator_1.body)("username")
        .isString()
        .isLength({ min: 3 })
        .withMessage("Username must be at least 3 characters long"),
    (0, express_validator_1.body)("password")
        .isString()
        .isLength({ min: 4 })
        .withMessage("Password must be at least 4 characters long"),
];
const changeLoginInfos = [
    (0, express_validator_1.body)("username")
        .isString()
        .isLength({ min: 4 })
        .withMessage("Username must be at least 3 characters long"),
    (0, express_validator_1.body)("password")
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
    (0, express_validator_1.body)("oldPassword")
        .isString()
        .isLength({ min: 4 })
        .withMessage("Password must be at least 4 characters long"),
    (0, express_validator_1.body)("confirmPassword")
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long"),
];
const createMembers = [
    (0, express_validator_1.body)("fullname").notEmpty().withMessage("Le nom est obligatoire"),
    (0, express_validator_1.body)("type").notEmpty().withMessage("Le type est obligatoire"),
    (0, express_validator_1.body)("gender").notEmpty().withMessage("Le genre est obligatoire"),
    (0, express_validator_1.body)("categoryId").notEmpty().withMessage("La fonction est obligatoire"),
    (0, express_validator_1.body)("status_civil").notEmpty().withMessage(`L'etat civil est obligatoire`),
    (0, express_validator_1.body)("number").notEmpty().withMessage("Le champs matricule est obligatoire"),
];
const updateUserInfos = [
    (0, express_validator_1.body)("username").notEmpty().withMessage("Username est obligatoire"),
    (0, express_validator_1.body)("phone").notEmpty().withMessage("Numero de telephone oblitoire"),
    (0, express_validator_1.body)("email").notEmpty().withMessage("Address email oblitoire"),
    (0, express_validator_1.body)("roleId").notEmpty().withMessage("Le role est obligatoire"),
];
exports.default = { login, createMembers, updateUserInfos, changeLoginInfos };
