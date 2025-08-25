"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../../shared/utils/response.util");
class HealthController {
    constructor() {
        this.getHealth = async (req, res) => {
            (0, response_util_1.setResponse)({
                res,
                message: "is run",
            });
        };
    }
}
exports.default = new HealthController();
//
