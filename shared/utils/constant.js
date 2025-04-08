"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_PORT = exports.DB_NAME = exports.DB_PASSWORD = exports.DB_USER = exports.DB_HOST = exports.DB_DIALECT = exports.SMTP_NAME = exports.SMTP_PASSWORD = exports.SMTP_USER = exports.SMTP_PORT = exports.SMTP_HOST = exports.BULKGATE_API = exports.KECCEL_DEFAULT_SEND_NAME = exports.KECCEL_API_TOKEN = exports.STORAGE_PORT = exports.DESKTOP_SERVER_PORT = exports.GATEWAY_SERVER_PORT = exports.COMPTABILITE_PORT = exports.AUTH_SERVER_PORT = exports.MESSAGE_SERVER_PORT = exports.JWT_SECRET = exports.ENV_MODE = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.ENV_MODE = process.env.ENV_MODE || "dev";
exports.JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret";
exports.MESSAGE_SERVER_PORT = process.env.MESSAGE_SERVER_PORT || 2007;
exports.AUTH_SERVER_PORT = process.env.AUTH_SERVER_PORT || 2005;
exports.COMPTABILITE_PORT = process.env.COMPTABILITE_PORT || 2005;
exports.GATEWAY_SERVER_PORT = process.env.GATEWAY_SERVER_PORT || 2000;
exports.DESKTOP_SERVER_PORT = process.env.DESKTOP_SERVER_PORT || 2003;
exports.STORAGE_PORT = process.env.STORAGE_PORT || 2006;
exports.KECCEL_API_TOKEN = process.env.KECCEL_API_TOKEN || "";
exports.KECCEL_DEFAULT_SEND_NAME = process.env.KECCEL_DEFAULT_SEND_NAME || "";
exports.BULKGATE_API = process.env.BULKGATE_API || "";
exports.SMTP_HOST = process.env.SMTP_HOST || "";
exports.SMTP_PORT = process.env.SMTP_PORT || 587;
exports.SMTP_USER = process.env.SMTP_USER || "";
exports.SMTP_PASSWORD = process.env.SMTP_PASS || "";
exports.SMTP_NAME = process.env.SMTP_NAME || "";
exports.DB_DIALECT = process.env.DB_DIALECT || "mysql";
exports.DB_HOST = exports.ENV_MODE === "dev"
    ? process.env.DB_DEV_HOST || "localhost"
    : process.env.DB_HOST || "postgres";
exports.DB_USER = exports.ENV_MODE === "dev"
    ? process.env.DB_DEV_USER || "postgres"
    : process.env.DB_USER || "postgres";
exports.DB_PASSWORD = exports.ENV_MODE === "dev"
    ? process.env.DB_DEV_PASSWORD || "root"
    : process.env.DB_PASSWORD || "postgres1995";
exports.DB_NAME = exports.ENV_MODE === "dev"
    ? process.env.DB_DEV_NAME || "mcollect_db_microservice"
    : process.env.DB_NAME || "mcollect_db_microservice";
exports.DB_PORT = exports.ENV_MODE === "dev"
    ? process.env.DB_DEV_PORT || 5432
    : process.env.DB_PORT || 5432;
