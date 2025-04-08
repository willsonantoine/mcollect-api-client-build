"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateTimeFull = exports.generateRandomPassword = exports.comparePassword = exports.encryptPasswordAsync = exports.encryptPassword = exports.sanitarizeId = exports.formatDateString = exports.isStrongPassword = exports.Validate = exports.pagination = exports.getDateTime = exports.getDate = void 0;
exports.writeLogToFile = writeLogToFile;
exports.generateStrongPassword = generateStrongPassword;
exports.getDeviceType = getDeviceType;
exports.getBrowser = getBrowser;
exports.formatDate = formatDate;
exports.formatNumber = formatNumber;
exports.generateUuidToken = generateUuidToken;
exports.generateUniqueId = generateUniqueId;
exports.isValidToken = isValidToken;
exports.formatDateSql = formatDateSql;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const response_util_1 = require("./response.util");
async function writeLogToFile(log, file = "log", send_to_slake = true) {
    try {
        const logDirectory = "./logs";
        const date = formatDate((0, exports.getDate)(new Date())).substring(0, 10);
        const logFilePath = path_1.default.join(logDirectory, `${file}-error-${date}.log`);
        // Vérifier si le dossier "logs" existe, sinon le créer
        if (!fs_1.default.existsSync(logDirectory)) {
            fs_1.default.mkdirSync(logDirectory);
        }
        fs_1.default.appendFile(logFilePath, `${(0, exports.getDateTime)(new Date())} ::: ${log} \n`, (err) => {
            if (err) {
                console.error("Error writing log to file:", err);
            }
        });
        // sendAdminNotifications(log.message, EnumNotification.ERROR);
    }
    catch (error) {
        console.log(error);
    }
}
const getDate = (dateParam) => {
    // Convert date
    return dateParam != undefined || dateParam != null
        ? dateParam
        : new Date().toISOString().split("T")[0];
};
exports.getDate = getDate;
function generateStrongPassword() {
    const length = 8;
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_-+=<>?/{}[]|";
    const allChars = uppercaseChars + lowercaseChars + numberChars + symbolChars;
    let password = "";
    // Ensure at least one character from each category
    password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
    password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
    password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
    password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
    // Fill the remaining characters randomly
    for (let i = 0; i < length - 4; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    // Shuffle the password to randomize character order
    password = password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
    return password;
}
const getDateTime = (dateTimeParam) => {
    const dateTime = dateTimeParam || new Date();
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} à ${hours}h ${minutes} min`;
};
exports.getDateTime = getDateTime;
function getDeviceType(userAgent) {
    const mobileRegex = /Android|iPhone|iPad|iPod|Opera Mini/i;
    const tabletRegex = /Tablet|iPad/i;
    if (mobileRegex.test(userAgent)) {
        if (tabletRegex.test(userAgent)) {
            return "tablet"; // C'est un iPad ou une autre tablette
        }
        return "mobile"; // C'est un téléphone
    }
    return "desktop"; // C'est un ordinateur de bureau (ou un appareil inconnu)
}
function getBrowser(userAgent) {
    if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome";
    }
    else if (userAgent.indexOf("Safari") > -1) {
        return "Safari";
    }
    else if (userAgent.indexOf("Firefox") > -1) {
        return "Firefox";
    }
    else if (userAgent.indexOf("Edge") > -1) {
        return "Edge";
    }
    else if (userAgent.indexOf("MSIE") > -1) {
        return "Internet Explorer";
    }
    else {
        return "Inconnu";
    }
}
function formatDate(datetime) {
    return (0, moment_1.default)(datetime).format("YYYY-MM-DD HH:mm:ss");
}
function formatNumber(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}
/**
 * Generates a random token in the format XXXX-XXXX-XXXX-XXXX
 * @returns {Promise<string>} A random token
 */
async function generateUuidToken() {
    const blocks = Array.from({ length: 4 }, () => Math.floor(1000 + Math.random() * 9000).toString());
    return blocks.join("-");
}
function generateUniqueId() {
    const now = new Date();
    const year = now.getFullYear(); // Année sur 4 chiffres (ex: 2025)
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Mois (01 à 12)
    const randomPart = Math.floor(100000000000 + Math.random() * 900000000000); // Nombre aléatoire à 12 chiffres
    return `${year}${month}${randomPart}`;
}
function isValidToken(token) {
    const regex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;
    return regex.test(token);
}
const pagination = (req) => {
    let page = req.query.page || 1; // page = 1
    let limit = req.query.limit || 10; // nombre d'enregistrements par page 10
    let offset = (page - 1) * limit;
    return { limit: parseInt(limit), offset: parseInt(String(offset)) };
};
exports.pagination = pagination;
const { validationResult } = require("express-validator");
const Validate = (validations) => {
    return [...validations, ValidateFields];
};
exports.Validate = Validate;
const ValidateFields = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors
            .array()
            .map((error) => `${error.path}: ${error.msg}`)
            .join(", ");
        (0, response_util_1.setResponse)({ res, message: errorMessages, statusCode: 400 });
        return;
    }
    return next();
};
const isStrongPassword = (password) => {
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return re.test(password);
};
exports.isStrongPassword = isStrongPassword;
const formatDateString = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Invalid Date"; // Or handle the error as appropriate
        }
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date"; // Or handle the error as appropriate
    }
};
exports.formatDateString = formatDateString;
const sanitarizeId = (accountId, accountNumber) => {
    if (accountId && accountNumber) {
        return accountId && accountId.length <= 8 ? accountId : accountNumber;
    }
    return accountId || "";
};
exports.sanitarizeId = sanitarizeId;
const encryptPassword = (password) => {
    const saltRounds = 10;
    const salt = bcryptjs_1.default.genSaltSync(saltRounds);
    return bcryptjs_1.default.hashSync(password, salt);
};
exports.encryptPassword = encryptPassword;
const encryptPasswordAsync = async (password) => {
    const saltRounds = 10;
    const salt = await bcryptjs_1.default.genSalt(saltRounds);
    return await bcryptjs_1.default.hash(password, salt);
};
exports.encryptPasswordAsync = encryptPasswordAsync;
const comparePassword = async (password, hash) => {
    return await bcryptjs_1.default.compare(password, hash);
};
exports.comparePassword = comparePassword;
const generateRandomPassword = () => {
    return (Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15));
};
exports.generateRandomPassword = generateRandomPassword;
function formatDateSql(input) {
    let date;
    if (typeof input === "string") {
        date = new Date(input);
    }
    else {
        date = input;
    }
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}
const getDateTimeFull = (dateTimeParam = new Date()) => {
    const dateTime = dateTimeParam || new Date();
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, "0");
    const day = String(dateTime.getDate()).padStart(2, "0");
    const hours = String(dateTime.getHours()).padStart(2, "0");
    const minutes = String(dateTime.getMinutes()).padStart(2, "0");
    const seconds = String(dateTime.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
exports.getDateTimeFull = getDateTimeFull;
