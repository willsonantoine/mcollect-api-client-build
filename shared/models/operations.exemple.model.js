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
const compte_model_1 = __importDefault(require("./compte.model"));
const currency_model_1 = __importDefault(require("./currency.model"));
class OperationsExempleModel extends sequelize_1.Model {
}
OperationsExempleModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
        field: "designation",
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
        field: "valeur_default",
    },
    currencyId: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    accountToId: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
        field: "id_compte_to",
    },
    accountFromId: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
        field: "id_compte_from",
    },
    motif: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
        field: "type_",
    },
    favorit: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    hasBilletage: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
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
    timestamps: true,
    tableName: "transactions",
    paranoid: true,
    charset: sequelize_2.CHARSET,
    collate: sequelize_2.COLLATE,
});
OperationsExempleModel.belongsTo(compte_model_1.default, {
    foreignKey: "id_compte_from",
    as: "accountFrom",
});
OperationsExempleModel.belongsTo(compte_model_1.default, {
    foreignKey: "id_compte_to",
    as: "accountTo",
});
OperationsExempleModel.belongsTo(currency_model_1.default, {
    foreignKey: "id_devise",
    as: "currency",
});
exports.default = OperationsExempleModel;
