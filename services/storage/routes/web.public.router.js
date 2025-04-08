"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const web_public_controller_1 = __importDefault(require("../controllers/web.public.controller"));
const WebPublicRouter = express_1.default.Router();
WebPublicRouter.get("/site/:token/find", web_public_controller_1.default.getSiteData);
WebPublicRouter.get("/blogs/:token/find", web_public_controller_1.default.getSiteBlogs);
WebPublicRouter.get("/blogs/:token/:categoryId/find", web_public_controller_1.default.getSiteBlogs);
WebPublicRouter.get("/blocs/:token/find", web_public_controller_1.default.getSiteBlocs);
WebPublicRouter.get("/blogs-category/:token/find", web_public_controller_1.default.getSiteCategories);
WebPublicRouter.get("/blog/:token/:url/find-by-url", web_public_controller_1.default.getBlogsByUrl);
exports.default = WebPublicRouter;
