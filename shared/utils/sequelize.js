"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.COLLATE = exports.CHARSET = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const constant_1 = require("./constant");
exports.CHARSET = "utf8mb4";
exports.COLLATE = "utf8mb4_0900_ai_ci";
dotenv_1.default.config();
const sequelize = new sequelize_1.Sequelize({
    dialect: constant_1.DB_DIALECT,
    host: constant_1.DB_HOST,
    port: Number(constant_1.DB_PORT),
    username: constant_1.DB_USER,
    password: constant_1.DB_PASSWORD,
    database: constant_1.DB_NAME,
    logging: false,
    pool: {
        max: 100, // Ajuster selon votre charge de travail
        min: 5, // Ajuster selon votre charge de travail
        acquire: 60000, // Ajuster selon votre charge de travail
        idle: 30000, // Ajuster selon votre charge de travail
    },
    dialectOptions: {
        charset: exports.CHARSET,
    },
});
sequelize
    .sync({ alter: true })
    .then(() => {
    console.log("Database synchronized");
})
    .catch((err) => {
    console.error("Error synchronizing database:", err);
});
exports.default = sequelize;
