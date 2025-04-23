"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("../utils/sequelize"));
const members_model_1 = __importDefault(require("./members.model"));
const site_mode_1 = __importDefault(require("./site.mode"));
class SiteMembersModel extends sequelize_1.Model {
}
SiteMembersModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    status: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true
    },
    statusAt: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: null
    }
}, {
    sequelize: sequelize_2.default,
    tableName: 'site_members',
});
SiteMembersModel.belongsTo(members_model_1.default, { as: 'member', foreignKey: 'memberId' });
SiteMembersModel.belongsTo(site_mode_1.default, { as: 'site', foreignKey: 'siteId' });
exports.default = SiteMembersModel;
