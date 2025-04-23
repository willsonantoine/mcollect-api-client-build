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
exports.EnumProduitType = void 0;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importStar(require("../utils/sequelize"));
const produit_subcategory_model_1 = __importDefault(require("./produit.subcategory.model"));
const users_model_1 = __importDefault(require("./users.model"));
const currency_model_1 = __importDefault(require("./currency.model"));
const site_mode_1 = __importDefault(require("./site.mode"));
var EnumProduitType;
(function (EnumProduitType) {
    EnumProduitType["PRODUIT"] = "Produit";
    EnumProduitType["SERVICE"] = "Service";
})(EnumProduitType || (exports.EnumProduitType = EnumProduitType = {}));
class ProduitModel extends sequelize_1.Model {
}
ProduitModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT("long"),
        defaultValue: null,
    },
    qte: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
    url: {
        type: sequelize_1.DataTypes.TEXT('long'),
        defaultValue: null
    },
    qte_min: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
    price_max: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
    price_min: {
        type: sequelize_1.DataTypes.FLOAT,
        defaultValue: 0,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: EnumProduitType.PRODUIT,
    },
    synchro: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    images: {
        type: sequelize_1.DataTypes.TEXT('long'),
        defaultValue: null
    },
    reference: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    brand: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    etat: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    stockLocation: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    unite: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null
    },
    showOnWeb: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    sequelize: sequelize_2.default,
    tableName: "produits",
    paranoid: true,
    charset: sequelize_2.CHARSET,
    collate: sequelize_2.COLLATE,
});
ProduitModel.belongsTo(currency_model_1.default, {
    as: 'currency',
    foreignKey: 'currencyId'
});
ProduitModel.belongsTo(produit_subcategory_model_1.default, {
    as: "subCategory",
    foreignKey: "subCategoryId",
});
ProduitModel.belongsTo(users_model_1.default, {
    as: "userCreated",
    foreignKey: "userCreatedId",
});
ProduitModel.belongsTo(users_model_1.default, {
    as: "userUpdated",
    foreignKey: "userUpdatedId",
});
ProduitModel.belongsTo(users_model_1.default, {
    as: "userDeleted",
    foreignKey: "userDeletedId",
});
ProduitModel.belongsTo(site_mode_1.default, { as: 'site', foreignKey: 'siteId' });
exports.default = ProduitModel;
