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
exports.AccountStatus = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importStar(require("../utils/sequelize"));
const compte_classes_model_1 = __importDefault(require("./compte.classes.model"));
const members_model_1 = __importDefault(require("./members.model"));
const users_model_1 = __importDefault(require("./users.model"));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIF"] = "Actif";
    AccountStatus["SUSPENDU"] = "Suspendu";
    AccountStatus["EN_EXAMEND"] = "En examen";
    AccountStatus["GELE"] = "GELE";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
class CompteModel extends sequelize_1.Model {
}
CompteModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    classId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_classe",
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "designation",
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userCreatedId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "user_creat",
    },
    number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_ref",
    },
    formuleBalance: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    update_solde: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    accountStatus: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: AccountStatus.ACTIF,
    },
    isActif: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: "0",
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
        field: "etat",
    },
    id_parent: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    isPeriodique: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    solde: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    isVerifyBalance: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_compte: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 0,
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
    memberId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_membre",
    },
    favorit: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 1,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "comptabilite_compte",
    timestamps: false,
    paranoid: true,
    collate: sequelize_2.COLLATE,
    charset: sequelize_2.CHARSET,
});
CompteModel.belongsTo(compte_classes_model_1.default, {
    foreignKey: "id_classe",
    as: "classe",
});
CompteModel.belongsTo(users_model_1.default, { as: 'userCreated', foreignKey: 'userCreatedId' });
CompteModel.belongsTo(members_model_1.default, { foreignKey: "id_membre", as: "member" });
exports.default = CompteModel;
