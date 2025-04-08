"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entreprise_model_1 = __importDefault(require("../../../shared/models/entreprise.model"));
const sequelize_1 = __importDefault(require("../../../shared/utils/sequelize"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
const compte_model_1 = __importDefault(require("../../../shared/models/compte.model"));
const succursale_model_1 = __importDefault(require("../../../shared/models/succursale.model"));
class SettingsServices {
    constructor() {
        this.makeCorrectionToStructure = async () => {
            await sequelize_1.default.query(`DELETE FROM  operations WHERE operations.compte_from NOT IN (SELECT id FROM comptabilite_compte);`);
            await sequelize_1.default.query(`DELETE FROM operations WHERE operations.compte_to NOT IN (SELECT id FROM comptabilite_compte);`);
            await sequelize_1.default.query(`DELETE FROM operations WHERE operations.id_devise NOT IN (SELECT id FROM devises);`);
            await sequelize_1.default.query(`UPDATE operations SET benefiaire=null WHERE operations.benefiaire NOT IN (SELECT id FROM membres);`);
            await sequelize_1.default.query(`DELETE FROM historiques WHERE historiques.id_compte NOT IN (SELECT id FROM comptabilite_compte);`);
            await sequelize_1.default.query(`DELETE FROM historiques WHERE historiques.id_compte_to NOT IN (SELECT id FROM comptabilite_compte);`);
            await sequelize_1.default.query(`DELETE FROM operations_billetage WHERE operations_billetage.id_operation NOT IN (SELECT id FROM operations);`);
        };
        this.updateEntrepriseInformations = async (data) => {
            let entreprise = await this.entrepriseModel.findOne(); // Trouve l'entreprise existante
            if (!entreprise) {
                entreprise = await this.entrepriseModel.create(data); // Crée une nouvelle entreprise
            }
            else {
                await this.entrepriseModel.update(data, {
                    where: { id: entreprise.id },
                    returning: true,
                });
                entreprise = await this.entrepriseModel.findByPk(entreprise.id); // Récupère l'entreprise mise à jour
            }
            return entreprise; // Retourne l'entreprise après traitement
        };
        this.getEntrepriseInformations = async () => {
            return await this.entrepriseModel.findOne({
                include: [
                    {
                        model: currency_model_1.default,
                        as: "currency",
                        attributes: ["id", "name"],
                    },
                    {
                        model: compte_model_1.default,
                        as: "account",
                        attributes: ["id", "name", "number"],
                    },
                    {
                        model: compte_model_1.default,
                        as: "partSocialAccount",
                        attributes: ["id", "name", "number"],
                    },
                ],
            });
        };
        this.getSuccursale = async () => {
            const countSuccursale = await this.succursale.count();
            if (countSuccursale === 0) {
                await this.succursale.create({ name: "Siège" });
            }
            return await this.succursale.findAndCountAll({
                order: [["createdAt", "desc"]],
            });
        };
        this.entrepriseModel = entreprise_model_1.default;
        this.succursale = succursale_model_1.default;
    }
}
exports.default = SettingsServices;
