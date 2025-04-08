"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constant_1 = require("../../shared/utils/constant");
const app_init_1 = require("../../shared/middleware/app.init");
const routers_1 = __importDefault(require("./routes/routers"));
const app = (0, app_init_1.AppInit)((0, express_1.default)());
app.use("/", routers_1.default);
app.listen(constant_1.MESSAGE_SERVER_PORT, () => {
    console.log(`Message Service running on port ${constant_1.MESSAGE_SERVER_PORT}`);
});
