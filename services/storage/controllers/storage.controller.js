"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../../shared/utils/response.util");
const storage_service_1 = __importDefault(require("../services/storage.service"));
const vars_1 = require("../../../shared/utils/vars");
class StorageController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const userId = req.user.id;
                const { filename, size, mimetype } = req.file;
                console.log(req.file);
                const result = await this.storageService.create({
                    size,
                    name: filename,
                    type: mimetype,
                    userCreatedId: userId,
                });
                (0, response_util_1.setResponse)({ res, data: { name: result.name } });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.findAll = async (req, res) => {
            try {
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.storageService.findFiles({ limit, offset });
                (0, response_util_1.setResponse)({ res, data: result });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.storageService = new storage_service_1.default();
    }
}
exports.default = new StorageController();
