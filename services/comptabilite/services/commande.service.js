"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commande_line_model_1 = __importDefault(require("../../../shared/models/commande.line.model"));
const commande_model_1 = __importDefault(require("../../../shared/models/commande.model"));
const currency_model_1 = __importDefault(require("../../../shared/models/currency.model"));
const produit_model_1 = __importDefault(require("../../../shared/models/produit.model"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
class CommandeService {
    constructor() {
        this.create = async (data) => {
            return await this.commandeModel.create(data);
        };
        this.countCommandes = async (siteId) => {
            return await this.commandeModel.count({
                where: {
                    siteId: siteId,
                },
            });
        };
        this.createLine = async (data) => {
            return await this.commandeLineModel.create(data);
        };
        this.getComandeLinesMaped = async (Lines) => {
            const lines = await Promise.all(Lines.map(async (line) => {
                const produit = await this.produitsModel.findOne({
                    where: {
                        id: line.productId,
                    },
                });
                return Object.assign(Object.assign({}, line), { produit: produit });
            }));
            return lines;
        };
        this.getAmountTotal = (lines) => {
            let total = 0;
            lines.forEach((line) => {
                var _a;
                total += line.quantity * (((_a = line.produit) === null || _a === void 0 ? void 0 : _a.price_max) || 0);
            });
            return total;
        };
        this.getCommandes = async ({ userId, siteId, }) => {
            const whereTarger = { userId };
            if (siteId) {
                whereTarger.siteId = siteId;
            }
            const commandes = await this.commandeModel.findAndCountAll({
                where: whereTarger,
                attributes: [
                    "id",
                    "commadeNumber",
                    "amount",
                    "status",
                    "payementMethod",
                    "phoneNumber",
                    "createdAt",
                    "updatedAt",
                ],
                include: [
                    { model: currency_model_1.default, as: "currency", attributes: ["id", "name"] },
                ],
                order: [["createdAt", "DESC"]],
            });
            const CommandeMaped = await Promise.all(commandes.rows.map(async (commande) => {
                const lines = await this.commandeLineModel.findAll({
                    where: {
                        commandeId: commande.id,
                    },
                    attributes: ["id", "quantity", "price", "produitId"],
                    order: [["createdAt", "asc"]],
                    include: [
                        {
                            model: produit_model_1.default,
                            as: "produit",
                            attributes: [
                                "id",
                                "name",
                                "price_max",
                                "images",
                                "unite",
                                "type",
                            ],
                        },
                    ],
                });
                return Object.assign(Object.assign({}, commande.toJSON()), { lines: lines.map((line) => {
                        return Object.assign(Object.assign({}, line.toJSON()), { produit: line.produit ? line.produit : null });
                    }) });
            }));
            return CommandeMaped;
        };
        this.getCommandesAdmin = async ({ siteId }) => {
            const whereTarger = {};
            if (siteId) {
                whereTarger.siteId = siteId;
            }
            const commandes = await this.commandeModel.findAndCountAll({
                where: whereTarger,
                attributes: [
                    "id",
                    "commadeNumber",
                    "amount",
                    "status",
                    "payementMethod",
                    "phoneNumber",
                    "createdAt",
                    "updatedAt",
                ],
                include: [
                    { model: currency_model_1.default, as: "currency", attributes: ["id", "name"] },
                    {
                        model: users_model_1.default,
                        as: "user",
                        attributes: ["id", "username", "phone", "avatar", "email"],
                    },
                ],
                order: [["createdAt", "DESC"]],
            });
            const CommandeMaped = await Promise.all(commandes.rows.map(async (commande) => {
                const lines = await this.commandeLineModel.findAll({
                    where: {
                        commandeId: commande.id,
                    },
                    attributes: ["id", "quantity", "price", "produitId"],
                    order: [["createdAt", "asc"]],
                    include: [
                        {
                            model: produit_model_1.default,
                            as: "produit",
                            attributes: [
                                "id",
                                "name",
                                "price_max",
                                "images",
                                "unite",
                                "type",
                            ],
                        },
                    ],
                });
                return Object.assign(Object.assign({}, commande.toJSON()), { lines: lines.map((line) => {
                        return Object.assign(Object.assign({}, line.toJSON()), { produit: line.produit ? line.produit : null });
                    }) });
            }));
            return { count: commandes.count, rows: CommandeMaped };
        };
        this.commandeModel = commande_model_1.default;
        this.commandeLineModel = commande_line_model_1.default;
        this.produitsModel = produit_model_1.default;
    }
}
exports.default = CommandeService;
