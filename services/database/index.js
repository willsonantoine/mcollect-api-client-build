"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constant_1 = require("../../shared/utils/constant");
const app_init_1 = require("../../shared/middleware/app.init");
const sequelize_1 = __importDefault(require("../../shared/utils/sequelize"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, app_init_1.AppInit)((0, express_1.default)());
const modelsDir = path_1.default.join(__dirname, "../../shared/models");
fs_1.default.readdirSync(modelsDir).forEach((file) => {
    if (file.endsWith(".model.ts") || file.endsWith(".model.js")) {
        require(path_1.default.join(modelsDir, file));
    }
});
sequelize_1.default
    .sync({ alter: true })
    .then(() => {
    console.log("Database synchronized");
})
    .catch((err) => {
    console.error("Error synchronizing database:", err);
});
app.listen(Number(constant_1.DATABASE_PORT), "0.0.0.0", () => {
    console.log(`DATABASE server started on port: ${constant_1.DATABASE_PORT}`);
});
