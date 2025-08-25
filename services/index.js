"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const constant_1 = require("../shared/utils/constant");
const routers_1 = __importDefault(require("./gateway/routes/routers"));
const app_init_1 = require("../shared/middleware/app.init");
const routers_2 = __importDefault(require("./auth/routes/routers"));
const router_1 = __importDefault(require("./storage/routes/router"));
const operations_router_1 = __importDefault(require("./comptabilite/routers/operations.router"));
const billetage_router_1 = __importDefault(require("./comptabilite/routers/billetage.router"));
const credit_router_1 = __importDefault(require("./comptabilite/routers/credit.router"));
const account_mendator_router_1 = __importDefault(require("./comptabilite/routers/account.mendator.router"));
const produit_router_1 = __importDefault(require("./comptabilite/routers/produit.router"));
const execrice_comptable_router_1 = __importDefault(require("./comptabilite/routers/execrice.comptable.router"));
const comptes_router_1 = __importDefault(require("./comptabilite/routers/comptes.router"));
const routers_3 = __importDefault(require("./messages/routes/routers"));
const health_controller_1 = __importDefault(require("./gateway/controllers/health.controller"));
const fix_duplicate_operations_1 = require("../shared/utils/fix-duplicate-operations");
const app = (0, app_init_1.AppInit)((0, express_1.default)());
app.use("/", routers_1.default);
app.use("/auth", routers_2.default);
app.use("/comptabilite", comptes_router_1.default);
app.use("/storage", router_1.default);
app.use("/operations", operations_router_1.default);
app.use("/billetage", billetage_router_1.default);
app.use("/credits", credit_router_1.default);
app.use("/mendator", account_mendator_router_1.default);
app.use("/produit", produit_router_1.default);
app.use("/exercice-comptable", execrice_comptable_router_1.default);
app.use("/messages", routers_3.default);
app.get("/health", health_controller_1.default.getHealth);
// Fonction pour initialiser l'application avec la correction des doublons
async function startApplication() {
    try {
        // Vérifier et corriger les doublons au démarrage
        console.log("🚀 Initialisation de l'application...");
        const hasDuplicates = await (0, fix_duplicate_operations_1.checkForDuplicateNumbers)();
        if (hasDuplicates) {
            console.log("⚠️  Doublons détectés dans les numéros d'opérations. Correction en cours...");
            await (0, fix_duplicate_operations_1.fixDuplicateOperationNumbers)();
        }
        else {
            console.log("✅ Aucun doublon détecté dans les numéros d'opérations.");
        }
        // Démarrer le serveur
        app.listen(Number(constant_1.PORT), "0.0.0.0", () => {
            console.log(`🌐 Gateway server started on port: ${constant_1.PORT}`);
        });
    }
    catch (error) {
        console.error("❌ Erreur lors de l'initialisation de l'application:", error);
        process.exit(1);
    }
}
// Démarrer l'application
startApplication();
