"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_util_1 = require("../../../shared/utils/response.util");
const synchro_service_1 = __importDefault(require("../services/synchro.service"));
const members_service_1 = __importDefault(require("../../auth/services/members.service"));
const produits_service_1 = __importDefault(require("../../gateway/services/produits.service"));
const operations_service_1 = __importDefault(require("../../comptabilite/services/operations.service"));
class SynchroController {
    constructor() {
        this.members = async (req, res) => {
            try {
                const data = req.body;
                const [fonction] = await this.memberService.getFonction(data.fonction);
                const formatedData = {
                    id: data.id,
                    fullname: data.nom,
                    number: data.matricule,
                    adress: data.adresse,
                    joinedAt: new Date(data.createdAt),
                    id_national_card: data.numero_card_id,
                    gender: data.genre,
                    type: data.type,
                    categoryId: fonction.id,
                    phone: data.phone,
                    mail: data.email,
                    date_birth: data.dateNaiss,
                    lieu_naiss: data.lieuxNaiss,
                };
                const exist = await this.synchroService.findById(data.id);
                if (exist) {
                    await this.synchroService.update(data.id, formatedData);
                }
                else {
                    await this.synchroService.create(formatedData);
                }
                (0, response_util_1.setResponse)({ res });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.stock = async (req, res) => {
            try {
                const succursale = req.succursale;
                const data = req.body;
                console.log(data);
                const categId = await this.produitService.getCategId(data.categorie);
                const subCategId = await this.produitService.getSubCategId({
                    name: data.sous_categorie,
                    categoryId: categId,
                });
                const productId = await this.produitService.getProductId({
                    name: data.name,
                    subCategoryId: subCategId,
                });
                const exist = await this.produitService.findByIdStock(data.id, succursale.id);
                const formatedData = {
                    id: data.id,
                    productId: productId,
                    qs: data.qs,
                    qv: data.qv,
                    qf: data.qf,
                    qte_min: data.qte_min,
                    succursaleId: succursale.id,
                };
                if (exist) {
                    console.log(`UPDATE ::: `);
                    await this.produitService.updateStock(data.id, formatedData);
                }
                else {
                    console.log(`INSERT ::: `);
                    await this.produitService.createStock(formatedData);
                }
                (0, response_util_1.setResponse)({ res });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.operations = async (req, res) => {
            try {
                const succursale = req.succursale;
                const data = req.body;
                console.log(data);
                const findCurrencyId = await this.operationService.getCurrencyId(data.devise);
                if (!findCurrencyId) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `La devise n'existe pas dans la base`,
                        statusCode: 400,
                    });
                    return;
                }
                const findMemberId = await this.synchroService.findCreateMemberId({
                    fullname: data.beneficiaire,
                    id: data.id_responsable,
                    phone: data.phone,
                });
                if (!findMemberId) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Le membre n'existe pas dans la base`,
                        statusCode: 400,
                    });
                    return;
                }
                const findUserId = await this.synchroService.findUserId({
                    username: data.userCreatedName,
                    id: data.id_user_create,
                });
                if (!findUserId) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Le membre n'existe pas dans la base`,
                        statusCode: 400,
                    });
                    return;
                }
                const formatedData = {
                    id: data.id,
                    amount: data.montant,
                    currencyId: findCurrencyId,
                    succursaleId: succursale.id,
                    type: data.type,
                    date_save: data.createdAt,
                    motif: data.motif,
                    memberId: findMemberId,
                    amount_in_letter: data.montant_toute_lettre,
                    number: data.numero,
                    userCreatedId: findUserId,
                };
                const existOp = await this.operationService.findOperationByIdAndSuccursale({
                    operationId: data.id,
                    succursaleId: succursale.id,
                    number: data.numero,
                });
                if (existOp) {
                    // Check if operation exists
                    await this.operationService.updateOperation(data.id, formatedData);
                    console.log("UPDATE::");
                }
                else {
                    await this.operationService.createFromSynchro(formatedData);
                    console.log("CREATE::");
                }
                (0, response_util_1.setResponse)({
                    res,
                    message: `Synchro Réussie avec success`,
                    statusCode: 200,
                });
            }
            catch (error) {
                (0, response_util_1.setResponse)({
                    res,
                    message: `Une erreur interne s'est produite`,
                    statusCode: 500,
                    error,
                });
            }
        };
        this.synchroService = new synchro_service_1.default();
        this.memberService = new members_service_1.default();
        this.produitService = new produits_service_1.default();
        this.operationService = new operations_service_1.default();
    }
}
exports.default = new SynchroController();
