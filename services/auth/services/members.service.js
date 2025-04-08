"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const members_model_1 = __importDefault(require("../../../shared/models/members.model"));
const members_category_model_1 = __importDefault(require("../../../shared/models/members.category.model"));
class MembersService {
    constructor() {
        this.findAll = async ({ limit = 10, offset = 0, search, gender, type = "", date1 = "", date2 = "", }) => {
            console.log(date1, date2);
            const whereTarget = date1 && date2
                ? {
                    createdAt: {
                        [sequelize_1.Op.and]: [
                            (0, sequelize_1.literal)(`DATE(MemberModel.createAt) >= '${date1}'`),
                            (0, sequelize_1.literal)(`DATE(MemberModel.createAt) <= '${date2}'`),
                        ],
                    },
                }
                : {};
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { fullname: { [sequelize_1.Op.like]: `%${search}%` } },
                    { phone: { [sequelize_1.Op.like]: `%${search}%` } },
                    { mail: { [sequelize_1.Op.like]: `%${search}%` } },
                    { adress: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            if (gender) {
                whereTarget.gender = gender;
            }
            if (type) {
                whereTarget.type = type;
            }
            return this.membersModel.findAndCountAll({
                limit,
                offset,
                where: whereTarget,
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
                attributes: [
                    "id",
                    "fullname",
                    "gender",
                    "nationality",
                    "adress",
                    "status_civil",
                    "date_birth",
                    "number",
                    "type",
                    "img",
                    "lieu_naiss",
                    "phone",
                    "categoryId",
                    "mail",
                    "joinedAt",
                    "createdAt",
                    "updatedAt",
                ],
            });
        };
        this.findById = async (memberId) => {
            return this.membersModel.findOne({ where: { id: memberId } });
        };
        this.create = async (data) => {
            return this.membersModel.create(data);
        };
        this.update = async (id, data) => {
            return this.membersModel.update(data, { where: { id }, returning: true });
        };
        this.getFonctions = async () => {
            return await this.membersFonctionModel.findAndCountAll({
                order: [["createdAt", "desc"]],
            });
        };
        this.getMembersType = () => {
            return [
                { id: "Membre", name: "Membre" },
                { id: "Agent", name: "Agent" },
                { id: "Mandataire", name: "Mandataire" },
                { id: "Héritier", name: "Héritier de compte" },
                { id: "Visiteurs", name: "Visiteurs" },
                { id: "Autre", name: "Autre" },
            ];
        };
        this.getCivilStatus = () => {
            return [
                { id: "Célibataire", name: "Célibataire" },
                { id: "Marié(e)", name: "Marié(e)" },
                { id: "Divorcé", name: "Divorcé" },
                { id: "Veuf(ve)", name: "Veuf ou Veuve" },
                { id: "Réligieux(se)", name: "Réligieux(se)" },
                { id: "Militaire", name: "Militaire" },
                { id: "Autre", name: "Autre" },
            ];
        };
        this.getGenders = () => {
            return [
                { id: "Masculin", name: "Masculin" },
                { id: "Feminin", name: "Feminin" },
                { id: "Personne morale", name: "Personne morale" },
                { id: "Organisation", name: "Organisation" },
                { id: "Autre", name: "Autre" },
            ];
        };
        this.deleteMember = async (id, userDeletedId) => {
            await this.membersModel.update({ userDeletedId }, { where: { id }, returning: true });
            return await this.membersModel.destroy({ where: { id } });
        };
        this.findByNumber = async (number) => {
            return await this.membersModel.findOne({ where: { number } });
        };
        this.findByPhone = async (phone) => {
            return await this.membersModel.findOne({ where: { phone } });
        };
        this.getAllGenders = async () => {
            return await this.membersModel.findAll({
                attributes: ["gender", [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("gender")), "count"]],
                group: ["gender"],
                raw: true,
                order: [[(0, sequelize_1.literal)("gender"), "asc"]],
            });
        };
        this.Statistics = async ({ date2, type, date1, }) => {
            const whereTarget = {
                createdAt: {
                    [sequelize_1.Op.and]: [
                        (0, sequelize_1.literal)(`DATE(MemberModel.createAt) >= '${date1}'`),
                        (0, sequelize_1.literal)(`DATE(MemberModel.createAt) <= '${date2}'`),
                    ],
                },
            };
            const genders = await this.membersModel.findAll({
                where: whereTarget,
                attributes: ["gender", [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("gender")), "count"]],
                group: ["gender"],
                raw: true,
                order: [[(0, sequelize_1.literal)("gender"), "asc"]],
            });
            const types = await this.membersModel.findAll({
                where: whereTarget,
                attributes: ["type", [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("type")), "count"]],
                group: ["type"],
                raw: true,
                order: [[(0, sequelize_1.literal)("type"), "asc"]],
            });
            const whereClause = Object.assign({}, whereTarget); // Copie de whereTarget pour éviter de le modifier directement
            if (type !== undefined && type !== null && type !== "") {
                // Vérifie si type est défini et non vide
                whereClause.type = type; // Ajoute la condition sur le type
            }
            const typesByGenders = await this.membersModel.findAll({
                where: whereClause, // Utilise la clause where modifiée
                attributes: [
                    "type",
                    "gender", // Inclure le genre dans les attributs
                    [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("type")), "count"],
                ],
                group: ["type", "gender"], // Grouper par type ET genre
                raw: true,
                order: [
                    [(0, sequelize_1.literal)("type"), "asc"], // Trier par type
                    [(0, sequelize_1.literal)("gender"), "asc"], // Puis par genre (optionnel)
                ],
            });
            const cilvilStatus = await this.membersModel.findAll({
                where: whereTarget,
                attributes: ["etat_civil", [(0, sequelize_1.fn)("COUNT", (0, sequelize_1.col)("etat_civil")), "count"]],
                group: ["etat_civil"],
                raw: true,
                order: [[(0, sequelize_1.literal)("etat_civil"), "asc"]],
            });
            const totalMembers = await this.membersModel.count({ where: whereTarget });
            return { totalMembers, genders, types, cilvilStatus, typesByGenders };
        };
        this.getNextNumber = async () => {
            const count = await this.membersModel.count({ paranoid: false });
            return count + 1;
        };
        this.getFonction = async (name) => {
            return await this.membersFonctionModel.findCreateFind({ where: { name } });
        };
        this.membersModel = members_model_1.default;
        this.membersFonctionModel = members_category_model_1.default; //
    }
}
exports.default = MembersService;
