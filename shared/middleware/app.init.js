"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppInit = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const AppInit = (app) => {
    // Configuration du proxy
    app.set("trust proxy", true);
    // Middleware de parsing
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true })); // Support des formulaires
    app.use(body_parser_1.default.text({ type: "text/xml" })); // Parsing XML
    // Middleware de sécurité
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: "*", // Configurer les origines autorisées
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }));
    // Middleware de compression
    app.use((0, compression_1.default)());
    // Middleware de logs
    app.use((0, morgan_1.default)("dev"));
    // Limitation de débit pour les requêtes
    const limiter = (0, express_rate_limit_1.default)({
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 1000, // Limite de 1000 requêtes par IP
        standardHeaders: true, // Retourne les infos de limitation dans les headers
        legacyHeaders: false, // Désactive les headers obsolètes
        message: "Too many requests from this IP, please try again later.",
    });
    app.use(limiter);
    // Serveur de fichiers statiques
    app.use("/storage", (req, res, next) => {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        express_1.default.static(path_1.default.join(__dirname, "../../../uploads"))(req, res, next); // Call next middleware
    });
    app.use("/mcollect-rapports", express_1.default.static(path_1.default.join(__dirname, "../../../mcollect-files")));
    // Gestion globale des erreurs
    app.use((err, req, res, next) => {
        console.error(err.stack); // Log de l'erreur
        res.status(500).json({
            error: true,
            message: "Internal Server Error",
            details: err.message, // Message détaillé de l'erreur (utile en développement)
        });
    });
    return app;
};
exports.AppInit = AppInit;
