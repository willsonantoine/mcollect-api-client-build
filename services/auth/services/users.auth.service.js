"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_auth_model_1 = __importDefault(require("../../../shared/models/users.auth.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constant_1 = require("../../../shared/utils/constant");
const sequelize_1 = __importDefault(require("../../../shared/utils/sequelize"));
class UsersAuthService {
    constructor() {
        this.create = async (data) => {
            return await this.userAuthModel.create(data);
        };
        this.generateToken = async (userId, role) => {
            const token = jsonwebtoken_1.default.sign({
                id: userId,
                role: role || "User",
            }, constant_1.JWT_SECRET || "default_secret");
            return token;
        };
        this.logOut = async (userId) => {
            await sequelize_1.default.query(`UPDATE log set asLogOut=1,asLogOutAt=now() WHERE id_user = '${userId}'`);
            return { message: "User logged out successfully" };
        };
        this.userAuthModel = users_auth_model_1.default;
    }
}
exports.default = UsersAuthService;
