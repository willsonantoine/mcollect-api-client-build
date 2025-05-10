"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_model_1 = __importDefault(require("../../../shared/models/otp.model"));
const vars_1 = require("../../../shared/utils/vars");
class OtpService {
    constructor() {
        this.create = async (userId) => {
            const code = (0, vars_1.generateOtp)();
            const now = new Date();
            const expireAt = new Date(now.setMinutes(now.getMinutes() + 15));
            return await this.otpModel.create({
                userId,
                code,
                expireAt,
                status: false,
            });
        };
        this.findByCode = async (code) => {
            return await this.otpModel.findOne({ where: { code } });
        };
        this.setVerify = async (otpId) => {
            return await this.otpModel.update({ status: true }, { where: { id: otpId }, returning: true });
        };
        this.otpModel = otp_model_1.default;
    }
}
exports.default = OtpService;
