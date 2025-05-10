"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const web_public_controller_1 = __importDefault(require("../controllers/web.public.controller"));
const contact_message_controller_1 = __importDefault(require("../controllers/contact.message.controller"));
const vars_1 = require("../../../shared/utils/vars");
const contact_message_validator_1 = __importDefault(require("../../comptabilite/validator/contact.message.validator"));
const users_controller_1 = __importDefault(require("../../auth/controllers/users.controller"));
const commande_controller_1 = __importDefault(require("../../comptabilite/controllers/commande.controller"));
const authToken_1 = require("../../../shared/middleware/authToken");
const commandes_validator_1 = __importDefault(require("../validator/commandes.validator"));
const auth_validator_1 = __importDefault(require("../../auth/validator/auth.validator"));
const WebPublicRouter = express_1.default.Router();
WebPublicRouter.get("/site/:token/find", web_public_controller_1.default.getSiteData);
WebPublicRouter.get("/blogs/:token/find", web_public_controller_1.default.getSiteBlogs);
WebPublicRouter.get("/blogs/:token/:categoryId/find", web_public_controller_1.default.getSiteBlogs);
WebPublicRouter.get("/blocs/:token/find", web_public_controller_1.default.getSiteBlocs);
WebPublicRouter.get("/blogs-category/:token/find", web_public_controller_1.default.getSiteCategories);
WebPublicRouter.get("/blog/:token/:url/find-by-url", web_public_controller_1.default.getBlogsByUrl);
WebPublicRouter.post("/contact/:token/message/create", (0, vars_1.Validate)(contact_message_validator_1.default.create), contact_message_controller_1.default.create);
WebPublicRouter.get("/contact/message/:siteId", contact_message_controller_1.default.findAll);
WebPublicRouter.get("/product/:token", web_public_controller_1.default.getProduit);
// commandes
WebPublicRouter.post("/product/commandes/:token", (0, vars_1.Validate)(commandes_validator_1.default.commandesValidator), (0, authToken_1.AuthToken)([authToken_1.EnumRoles.User, authToken_1.EnumRoles.Guest]), commande_controller_1.default.createCommande);
WebPublicRouter.get("/product/commandes/:token", (0, authToken_1.AuthToken)([authToken_1.EnumRoles.User, authToken_1.EnumRoles.Guest]), commande_controller_1.default.getCommandes);
// auth
WebPublicRouter.get("/members/:token", web_public_controller_1.default.getMembers);
WebPublicRouter.post("/auth/create-account/:token", users_controller_1.default.create);
WebPublicRouter.get("/auth/resend-otp/:token/:phone", users_controller_1.default.resendOtp);
WebPublicRouter.post("/auth/verify-otp/:token", users_controller_1.default.verifyOtp);
WebPublicRouter.post("/auth/login/:token", users_controller_1.default.login);
WebPublicRouter.post("/auth/recover-password/:token", (0, vars_1.Validate)(auth_validator_1.default.recoverPassword), users_controller_1.default.recoverPassword);
exports.default = WebPublicRouter;
