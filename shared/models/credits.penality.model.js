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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importStar(require("../utils/sequelize"));
class CreditPenalityModel extends sequelize_1.Model {
}
CreditPenalityModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4(),
        primaryKey: true,
    },
    dayMin: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        field: "jour_min",
    },
    dayMax: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        field: "jour_max",
    },
    percentage: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
        field: "pourcent",
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        field: "etat",
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
    tableName: "penalites_credit",
    paranoid: true,
    timestamps: true,
    collate: sequelize_2.COLLATE,
    charset: sequelize_2.CHARSET,
});
exports.default = CreditPenalityModel;
