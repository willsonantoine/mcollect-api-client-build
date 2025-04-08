"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constant_1 = require("../../shared/utils/constant");
const routers_1 = __importDefault(require("./routes/routers"));
const app_init_1 = require("../../shared/middleware/app.init");
const app = (0, app_init_1.AppInit)((0, express_1.default)());
app.use("/", routers_1.default);
app.listen(Number(constant_1.GATEWAY_SERVER_PORT), "0.0.0.0", () => {
    console.log(`Gateway server started on port: ${constant_1.GATEWAY_SERVER_PORT}`);
});
