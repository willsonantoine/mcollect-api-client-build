"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create = void 0;
const express_validator_1 = require("express-validator");
exports.create = [
    // --- Email Validation ---
    (0, express_validator_1.body)('email')
        .trim() // Remove leading/trailing whitespace FIRST
        .notEmpty().withMessage("Le mail ne peut pas etre vide") // Then check if empty
        .isEmail().withMessage("Le mail n'est pas valide")
        .normalizeEmail() // Optional: Canonicalize email (lowercase, remove dots/+, etc. for some providers) - use carefully
        .isLength({ max: 254 }).withMessage("L'email ne peut pas dépasser 254 caractères"), // Add max length check
    // --- Name Validation ---
    (0, express_validator_1.body)("name")
        .trim() // Remove whitespace
        .notEmpty().withMessage("Le nom ne peut pas etre vide") // Check emptiness
        .isLength({ min: 2, max: 100 }).withMessage("Le nom doit contenir entre 2 et 100 caractères") // Add length constraints
        .escape(), // IMPORTANT: Sanitize by escaping HTML entities (<, >, &, ', ") to prevent XSS when displaying this name later.
    // --- Subject Validation ---
    (0, express_validator_1.body)("sujet") // Changed from 'sujet' to 'subject' if field name changed, keep as 'sujet' if that's the field name
        .trim()
        .notEmpty().withMessage("Le sujet ne peut pas etre vide")
        .isLength({ min: 3, max: 150 }).withMessage("Le sujet doit contenir entre 3 et 150 caractères") // Add length constraints
        .escape(), // Sanitize for display safety
    // --- Message Validation ---
    (0, express_validator_1.body)("message")
        .trim()
        .notEmpty().withMessage("Le message ne peut pas etre vide")
        .isLength({ min: 10, max: 2000 }).withMessage("Le message doit contenir entre 10 et 2000 caractères") // Add length constraints
        .escape() // CRUCIAL: Sanitize message content for display safety. Further sanitization might be needed depending on usage.
];
exports.default = { create: exports.create };
