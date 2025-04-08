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
class MemberModel extends sequelize_1.Model {
}
MemberModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    fullname: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    mail: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    adress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    date_birth: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    nationality: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    lieu_naiss: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    img: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    deleted: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    status_civil: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "etat_civil",
    },
    categoryId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_categ",
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "id_compte",
    },
    userDeletedId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "user_deleted",
    },
    id_grouppement_clan: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pere: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    mere: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    enfant: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    niveau_etude: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    section_faculte: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    domaine: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    activite: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    entreprise: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    fonction_actuelle: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    biographie: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    on_web: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    solde_point: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
    id_national_card: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    reseau_facebook: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    reseau_linkedin: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    reseau_tweeter: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    reseau_instagram: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    reseau_whatsap: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    pays: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    territoire: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    ville: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    commune: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    quartier: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    avenue: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    province: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    numero: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    reseau_url_blog: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userUpdatedId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        field: "user_update",
    },
    status: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
        field: "etat",
    },
    updateAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    joinedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "date_adhesion",
    },
    deletedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: "date_deleted",
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
        field: "createAt",
    },
    id_cooperative: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    userCreatedId: {
        type: sequelize_1.DataTypes.UUIDV4,
        defaultValue: null,
        field: "user_create",
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: new Date(),
        field: "createAt",
    },
    card_url: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    signature_url: {
        type: sequelize_1.DataTypes.TEXT("long"),
        defaultValue: null,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "membres",
    timestamps: true,
    paranoid: true,
    collate: sequelize_2.COLLATE,
    charset: sequelize_2.CHARSET,
});
MemberModel.belongsTo(users_model_1.default, {
    as: "userCreated",
    foreignKey: "user_create",
});
// MemberModel.belongsTo(MemberCategoryModel, {
//   as: "memberCategory",
//   foreignKey: "id_categ",
// });
exports.default = MemberModel;
