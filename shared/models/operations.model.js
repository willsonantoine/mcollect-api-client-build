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
const members_model_1 = __importDefault(require("./members.model"));
const users_model_1 = __importDefault(require("./users.model"));
const succursale_model_1 = __importDefault(require("./succursale.model"));
const operations_exemple_model_1 = __importDefault(require("./operations.exemple.model"));
class OperationModel extends sequelize_1.Model {
}
OperationModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    transactionId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_transaction",
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    amount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
        field: "montant",
    },
    succursaleId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_succursale",
    },
    currencyId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_devise",
    },
    amount_in_letter: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "montant_toutelettre",
    },
    motif: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    isRemboursement: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    memberId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "benefiaire",
    },
    accountFromId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "compte_from",
    },
    accountToId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "compte_to",
    },
    numero: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    date_save: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    userCreatedId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "user_create",
    },
    reference: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "ref",
    },
    number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "numero",
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: "etat",
    },
    reste: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0,
    },
    deleted: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
    },
    userDeleted: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "deletedAt",
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "updateAt",
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "createAt",
    },
    userPrintId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "user_print",
    },
    printedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "print_time",
    },
    printStatus: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: "print",
    },
    userDeletedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null,
    },
    observation: {
        type: sequelize_1.DataTypes.TEXT("long"),
        defaultValue: null,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "operations",
    timestamps: false,
    paranoid: true,
    charset: sequelize_2.CHARSET,
    collate: sequelize_2.COLLATE,
});
OperationModel.belongsTo(compte_model_1.default, {
    foreignKey: "compte_from",
    as: "compteFrom",
});
OperationModel.belongsTo(compte_model_1.default, {
    foreignKey: "compte_to",
    as: "compteTo",
});
OperationModel.belongsTo(currency_model_1.default, {
    foreignKey: "id_devise",
    as: "currency",
});
OperationModel.belongsTo(members_model_1.default, {
    foreignKey: "benefiaire",
    as: "beneficiaire",
});
OperationModel.belongsTo(users_model_1.default, {
    as: "userCreated",
    foreignKey: "user_create",
});
OperationModel.belongsTo(succursale_model_1.default, {
    as: "succursale",
    foreignKey: "id_succursale",
});
OperationModel.belongsTo(operations_exemple_model_1.default, {
    as: "model",
    foreignKey: "id_transaction",
});
exports.default = OperationModel;
