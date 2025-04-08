"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.successResponse = void 0;
exports.setResponse = setResponse;
const vars_1 = require("./vars");
const constant_1 = require("./constant");
const successResponse = (message, data, status = 200) => {
    return {
        success: true,
        message,
        data,
        status,
    };
};
exports.successResponse = successResponse;
const errorResponse = (message, error, status = 500) => {
    const isProduction = process.env.NODE_ENV === "production";
    return {
        success: false,
        message: isProduction && status >= 500 ? "Internal Server Error" : message,
        error: isProduction ? undefined : error,
        status,
    };
};
exports.errorResponse = errorResponse;
function setResponse({ res, message = "Traitement réussie avec success", statusCode = 200, data = null, error = null, }) {
    // Logging en cas d'erreur
    if (statusCode >= 500 && error) {
        console.error(`[${new Date().toISOString()}] Internal Server Error:`, error);
        (0, vars_1.writeLogToFile)(error, "internal-server-error").then((r) => console.log("write-log-to-file"));
    }
    // Définit si la réponse est un succès ou un échec
    const success = statusCode >= 200 && statusCode < 400;
    // Format de la réponse JSON
    return res
        .status(statusCode || 200)
        .setHeader("Content-Type", "application/json")
        .json(Object.assign({ success, status: statusCode, message,
        data }, (error && {
        error: constant_1.ENV_MODE === "dev" ? error : "An internal error occurred",
    })));
}
