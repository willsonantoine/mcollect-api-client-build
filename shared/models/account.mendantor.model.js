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
const members_model_1 = __importDefault(require("./members.model"));
const compte_model_1 = __importDefault(require("./compte.model"));
const users_model_1 = __importDefault(require("./users.model"));
class AccountMendatorModel extends sequelize_1.Model {
}
AccountMendatorModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    memberId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_membre",
    },
    accountId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_compte",
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true,
        field: "etat",
    },
    userCreatedId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userUpdatedId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
        field: "userUpdate",
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "createAt",
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "updateAt",
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "comptabilite_compte_mandateur",
    paranoid: true,
    collate: sequelize_2.COLLATE,
    charset: sequelize_2.CHARSET,
    timestamps: true,
});
AccountMendatorModel.belongsTo(members_model_1.default, {
    as: "member",
    foreignKey: "id_membre",
});
AccountMendatorModel.belongsTo(compte_model_1.default, {
    as: "account",
    foreignKey: "id_compte",
});
AccountMendatorModel.belongsTo(users_model_1.default, {
    as: "userCreated",
    foreignKey: "userCreatedId",
});
AccountMendatorModel.belongsTo(users_model_1.default, {
    as: "userDeleted",
    foreignKey: "userDelete",
});
AccountMendatorModel.belongsTo(users_model_1.default, {
    as: "userUpdated",
    foreignKey: "userDeleteId",
});
exports.default = AccountMendatorModel;
