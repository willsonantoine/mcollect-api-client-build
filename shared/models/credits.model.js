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
const operations_model_1 = __importDefault(require("./operations.model"));
const users_model_1 = __importDefault(require("./users.model"));
class CreditModel extends sequelize_1.Model {
}
CreditModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        field: "id", // Keep original column name
    },
    number: {
        type: sequelize_1.DataTypes.STRING,
        field: "number",
        defaultValue: null,
    },
    month: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
        field: "mois",
    },
    deletedReason: {
        type: sequelize_1.DataTypes.TEXT,
        defaultValue: null,
    },
    rate: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true,
        field: "taux",
    },
    guarantees: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
        field: "garentis",
    },
    reason: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
        field: "motif",
    },
    observation: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
        field: "observation",
    },
    startDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "date_debut",
    },
    endDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "date_fin",
    },
    userCreatedId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "userCreate",
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "createAt",
    },
    remaining: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: true,
        field: "reste",
    },
    creditType: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "Normal",
        allowNull: true,
        field: "type_credit",
    },
    requestedAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        field: "montant_demande",
    },
    amountInWords: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: "montant_toutelettre",
    },
    interestAmount: {
        type: sequelize_1.DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
        field: "montant_interet",
    },
    updateObservation: {
        type: sequelize_1.DataTypes.TEXT("long"),
        allowNull: true,
        field: "observation_update",
    },
    userUpdated: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "userUpdate",
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: "updateAt",
    },
    addedDate: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: false,
        field: "dateAdd",
    },
    userDeleted: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "user_deleted",
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "date_deleted",
    },
    isDeleted: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: true,
        field: "deleted",
    },
    documentAttached: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
        field: "document_attached",
    },
    idOperation: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
        field: "id_operation",
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "operation_credit",
    timestamps: true, // Because you're handling timestamps manually
    paranoid: true,
    charset: sequelize_2.CHARSET,
    collate: sequelize_2.COLLATE,
});
CreditModel.belongsTo(operations_model_1.default, {
    as: "operation",
    foreignKey: "id_operation",
});
CreditModel.belongsTo(users_model_1.default, {
    as: "user_created",
    foreignKey: "userCreate",
});
CreditModel.belongsTo(users_model_1.default, {
    as: "user_delete",
    foreignKey: "user_deleted",
});
exports.default = CreditModel;
