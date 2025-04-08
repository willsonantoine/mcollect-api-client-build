"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dashboard_service_1 = __importDefault(require("../services/dashboard.service"));
const response_util_1 = require("../../../shared/utils/response.util");
class DashboardController {
    constructor() {
        this.getDashboard = async (req, res) => {
            try {
                const filterId = req.query.filterId || "month"; // Default filter is 'month'
                const result = await this.dashboardService.getDashInfo(filterId);
                return (0, response_util_1.setResponse)({
                    res,
                    data: result,
                });
            }
            catch (e) {
                (0, response_util_1.setResponse)({ res, statusCode: 500, message: e.message });
            }
        };
        this.dashboardService = new dashboard_service_1.default();
    }
}
exports.default = new DashboardController();
