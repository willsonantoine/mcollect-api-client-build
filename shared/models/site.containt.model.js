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
exports.SiteContaintType = exports.SiteContaintStatus = void 0;
const sequelize_1 = require("sequelize");
const users_model_1 = __importDefault(require("./users.model"));
const sequelize_2 = __importStar(require("../utils/sequelize"));
const site_mode_1 = __importDefault(require("./site.mode"));
const site_containt_category_model_1 = __importDefault(require("./site.containt.category.model"));
var SiteContaintStatus;
(function (SiteContaintStatus) {
    SiteContaintStatus["EDITING"] = "Brouillon";
    SiteContaintStatus["PUBLISH"] = "Publi\u00E9";
    SiteContaintStatus["SUSPENDU"] = "Suspendu";
})(SiteContaintStatus || (exports.SiteContaintStatus = SiteContaintStatus = {}));
var SiteContaintType;
(function (SiteContaintType) {
    SiteContaintType["BLOG"] = "Blog";
    SiteContaintType["TEXT"] = "Bloc";
    SiteContaintType["SLIDER"] = "slider";
})(SiteContaintType || (exports.SiteContaintType = SiteContaintType = {}));
class SiteContaintModel extends sequelize_1.Model {
}
SiteContaintModel.init({
    id: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: sequelize_1.DataTypes.UUIDV4(),
        primaryKey: true,
    },
    title: {
        type: sequelize_1.DataTypes.TEXT("long"),
        defaultValue: null,
    },
    subTitle: {
        type: sequelize_1.DataTypes.TEXT("long"),
        defaultValue: null,
    },
    type: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: SiteContaintType.TEXT,
    },
    publishDate: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null,
    },
    description: {
        type: sequelize_1.DataTypes.TEXT("long"),
        defaultValue: null,
    },
    urlVideo: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    texte: {
        type: sequelize_1.DataTypes.TEXT("long"),
        defaultValue: null,
    },
    format: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    images: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    url: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    favorit: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    metaTags: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: null,
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        defaultValue: SiteContaintStatus.EDITING,
    },
}, {
    sequelize: sequelize_2.default,
    tableName: "web_site_containt",
    paranoid: true,
    charset: sequelize_2.CHARSET,
    collate: sequelize_2.COLLATE,
});
SiteContaintModel.belongsTo(site_mode_1.default, { as: "site", foreignKey: "siteId" });
SiteContaintModel.belongsTo(users_model_1.default, {
    as: "userCreated",
    foreignKey: "userCreatedId",
});
SiteContaintModel.belongsTo(users_model_1.default, {
    as: "userUpdated",
    foreignKey: "userUpdatedId",
});
SiteContaintModel.belongsTo(site_containt_category_model_1.default, {
    as: "category",
    foreignKey: "categoryId",
});
exports.default = SiteContaintModel;
