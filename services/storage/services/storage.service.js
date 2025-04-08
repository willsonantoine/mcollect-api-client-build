"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const storage_model_1 = __importDefault(require("../../../shared/models/storage.model"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
class StorageService {
    constructor() {
        this.create = async (data) => {
            return this.storageModel.create(data);
        };
        this.findFiles = async ({ limit, offset, }) => {
            return this.storageModel.findAndCountAll({
                limit,
                offset,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                include: [
                    {
                        model: users_model_1.default,
                        as: "userCreated",
                        attributes: ["id", "username", "avatar"],
                    },
                ],
            });
        };
        this.storageModel = storage_model_1.default;
    }
}
exports.default = StorageService;
