"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importStar(require("../utils/sequelize"));
const users_model_1 = __importDefault(require("./users.model"));
const access_model_1 = __importDefault(require("./access.model"));
class AccessUserModel extends sequelize_1.Model {
}
AccessUserModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "updateAt",
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        field: "etat",
    },
    userCreatedId: {
        type: sequelize_1.DataTypes.STRING,
        field: "userCreated",
    },
    userId: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
        field: "id_user",
    },
    accessId: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: null,
        field: "id_access",
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "users_access",
    paranoid: true,
    timestamps: true,
    charset: sequelize_2.CHARSET,
    collate: sequelize_2.COLLATE,
});
AccessUserModel.belongsTo(users_model_1.default, { as: "user", foreignKey: "id_user" });
AccessUserModel.belongsTo(users_model_1.default, {
    as: "userCreate",
    foreignKey: "userCreated",
});
AccessUserModel.belongsTo(access_model_1.default, {
    as: "access",
    foreignKey: "id_access",
});
exports.default = AccessUserModel;
