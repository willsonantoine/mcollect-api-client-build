"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthToken = exports.EnumRoles = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_model_1 = __importDefault(require("../models/users.model"));
const response_util_1 = require("../utils/response.util");
const users_auth_model_1 = __importDefault(require("../models/users.auth.model"));
const users_roles_1 = __importDefault(require("../models/users.roles"));
var EnumRoles;
(function (EnumRoles) {
    EnumRoles["SuperAdmin"] = "SuperAdmin";
    EnumRoles["Admin"] = "Admin";
    EnumRoles["User"] = "User";
    EnumRoles["Guest"] = "Guest";
})(EnumRoles || (exports.EnumRoles = EnumRoles = {}));
const AuthToken = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ message: "Token d'authentification manquant" });
                return;
            }
            const token = authHeader.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "default_secret");
            const userObject = await users_model_1.default.findOne({
                where: { id: decoded.id },
                include: [{ model: users_roles_1.default, as: "role" }],
            });
            if (!userObject) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Utilisateur non trouvé`,
                    statusCode: 404,
                });
                return;
            }
            const findToken = await users_auth_model_1.default.findOne({
                where: { userId: decoded.id, token, asLogOut: 0 },
            });
            if (!findToken) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Token d'authentification invalide`,
                    statusCode: 401,
                });
                return;
            }
            if (!allowedRoles.includes(userObject.role.name)) {
                (0, response_util_1.setResponse)({ res, message: `Accès refusé`, statusCode: 403 });
                return;
            }
            req.user = Object.assign(Object.assign({}, decoded), { token });
            next();
        }
        catch (error) {
            (0, response_util_1.setResponse)({
                res,
                message: `Une erreur interne s'est produite veuillez reessayer plus tard`,
                statusCode: 500,
                error,
            });
            return;
        }
    };
};
exports.AuthToken = AuthToken;
