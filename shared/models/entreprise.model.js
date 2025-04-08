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
exports.EntrepriseModel = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importStar(require("../utils/sequelize"));
const currency_model_1 = __importDefault(require("./currency.model"));
const compte_model_1 = __importDefault(require("./compte.model"));
const compte_classes_model_1 = __importDefault(require("./compte.classes.model"));
class EntrepriseModel extends sequelize_1.Model {
}
exports.EntrepriseModel = EntrepriseModel;
// Initialisation du modèle
EntrepriseModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    adresse: sequelize_1.DataTypes.STRING,
    app_name: sequelize_1.DataTypes.STRING,
    count_facture_print: sequelize_1.DataTypes.STRING,
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    email: sequelize_1.DataTypes.STRING,
    etat: sequelize_1.DataTypes.STRING,
    id_nat: sequelize_1.DataTypes.STRING,
    img: sequelize_1.DataTypes.STRING,
    is_checked: sequelize_1.DataTypes.STRING,
    is_facture: sequelize_1.DataTypes.STRING,
    is_validate_bon: sequelize_1.DataTypes.STRING,
    logo: sequelize_1.DataTypes.STRING,
    name: sequelize_1.DataTypes.STRING,
    nb: sequelize_1.DataTypes.STRING,
    number_user_validations: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: 1,
    },
    phone: sequelize_1.DataTypes.STRING,
    rccm: sequelize_1.DataTypes.STRING,
    succursale: sequelize_1.DataTypes.STRING,
    synchro: sequelize_1.DataTypes.STRING,
    updatedAt: sequelize_1.DataTypes.DATE,
    agrement: sequelize_1.DataTypes.STRING,
    numero_impot: sequelize_1.DataTypes.STRING,
    smsToken: sequelize_1.DataTypes.STRING,
    accountNumberPrefix: sequelize_1.DataTypes.STRING,
    smsCost: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
    smsSendName: sequelize_1.DataTypes.STRING,
    prefixMatriculeMembers: sequelize_1.DataTypes.STRING,
    images_sizes: {
        type: sequelize_1.DataTypes.TEXT("long"),
        defaultValue: null,
    },
    desktop_synchro_token: sequelize_1.DataTypes.TEXT("long"),
}, {
    sequelize: sequelize_2.default,
    tableName: "entreprise",
    timestamps: true,
    paranoid: true,
    collate: sequelize_2.COLLATE,
    charset: sequelize_2.CHARSET,
});
EntrepriseModel.belongsTo(currency_model_1.default, {
    as: "currency",
    foreignKey: "smsCurrencyId",
});
EntrepriseModel.belongsTo(compte_model_1.default, {
    as: "account",
    foreignKey: "smsAccountId",
});
EntrepriseModel.belongsTo(compte_model_1.default, {
    as: "partSocialAccount",
    foreignKey: "partSocialAccountId",
});
EntrepriseModel.belongsTo(compte_classes_model_1.default, {
    as: "memberAccountClass",
    foreignKey: "memberAcountClassId",
});
exports.default = EntrepriseModel;
