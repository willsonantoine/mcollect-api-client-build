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
Object.defineProperty(exports, "__esModule", { value: true });
exports.startAutoBackup = void 0;
const cron = __importStar(require("node-cron"));
const constant_1 = require("./constant");
const backup_dbo_1 = require("./backup.dbo");
// Configuration (à récupérer depuis les variables d'environnement !)
const config = {
    database: constant_1.DB_NAME || "default_db",
    username: constant_1.DB_USER || "default_user",
    password: constant_1.DB_PASSWORD || "default_password", // A éviter !
    host: constant_1.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306", 10),
    dialect: constant_1.DB_DIALECT,
};
const startAutoBackup = async () => {
    (0, backup_dbo_1.backup)(false);
    cron.schedule("0 * * * *", async () => {
        console.log("Début de la sauvegarde automatique (toutes les heures)...");
        try {
            (0, backup_dbo_1.backup)(false);
            await (0, backup_dbo_1.deleteOldBackups)();
        }
        catch (error) {
            console.error("Erreur lors de la sauvegarde automatique:", error);
        }
    });
    console.log("Planificateur de sauvegarde démarré (toutes les heures).");
};
exports.startAutoBackup = startAutoBackup;
