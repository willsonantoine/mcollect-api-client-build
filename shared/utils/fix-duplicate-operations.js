"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixDuplicateOperationNumbers = fixDuplicateOperationNumbers;
exports.checkForDuplicateNumbers = checkForDuplicateNumbers;
const sequelize_1 = require("sequelize");
const sequelize_2 = __importDefault(require("./sequelize"));
/**
 * Script pour corriger les doublons dans les numéros d'opérations
 * Équivalent TypeScript du script MySQL fourni
 */
async function fixDuplicateOperationNumbers() {
    var _a;
    try {
        console.log("🔧 Début de la correction des doublons dans les numéros d'opérations...");
        // Étape 1: Obtenir le dernier numéro maximum
        const maxNumeroResult = (await sequelize_2.default.query("SELECT MAX(CAST(numero AS UNSIGNED)) as maxNumero FROM operations WHERE numero IS NOT NULL AND numero != ''", {
            type: sequelize_1.QueryTypes.SELECT,
            raw: true,
        }));
        let lastNum = ((_a = maxNumeroResult[0]) === null || _a === void 0 ? void 0 : _a.maxNumero) || 0;
        console.log(`📊 Dernier numéro trouvé: ${lastNum}`);
        // Étape 2: Identifier les opérations avec des numéros dupliqués (en gardant la plus ancienne)
        const duplicateOperations = (await sequelize_2.default.query(`
      SELECT o.id, o.numero, o.createAt,
             ROW_NUMBER() OVER (PARTITION BY o.numero ORDER BY o.createAt ASC) AS rn
      FROM operations o
      WHERE o.numero IS NOT NULL 
        AND o.numero != ''
        AND o.numero IN (
          SELECT numero 
          FROM operations 
          WHERE numero IS NOT NULL AND numero != ''
          GROUP BY numero 
          HAVING COUNT(*) > 1
        )
      ORDER BY o.numero, o.createAt ASC
    `, {
            type: sequelize_1.QueryTypes.SELECT,
            raw: true,
        }));
        if (duplicateOperations.length === 0) {
            console.log("✅ Aucun doublon trouvé dans les numéros d'opérations.");
            return;
        }
        console.log(`🔍 ${duplicateOperations.length} opérations avec des numéros dupliqués trouvées.`);
        // Étape 3: Mettre à jour les doublons (rn > 1) avec de nouveaux numéros
        const duplicatesToUpdate = duplicateOperations.filter((op) => op.rn > 1);
        if (duplicatesToUpdate.length === 0) {
            console.log("✅ Tous les doublons ont déjà été résolus.");
            return;
        }
        console.log(`🔄 Mise à jour de ${duplicatesToUpdate.length} opérations dupliquées...`);
        // Utiliser une transaction pour assurer la cohérence
        await sequelize_2.default.transaction(async (transaction) => {
            for (const operation of duplicatesToUpdate) {
                lastNum += 1;
                await sequelize_2.default.query("UPDATE operations SET numero = :newNumero WHERE id = :operationId", {
                    replacements: {
                        newNumero: lastNum.toString(),
                        operationId: operation.id,
                    },
                    type: sequelize_1.QueryTypes.UPDATE,
                    transaction,
                });
                console.log(`   ✓ Opération ${operation.id}: ${operation.numero} → ${lastNum}`);
            }
        });
        console.log(`✅ Correction terminée! ${duplicatesToUpdate.length} numéros d'opérations ont été corrigés.`);
    }
    catch (error) {
        console.error("❌ Erreur lors de la correction des doublons:", error);
        throw error;
    }
}
/**
 * Fonction pour vérifier s'il y a des doublons
 */
async function checkForDuplicateNumbers() {
    try {
        const duplicates = (await sequelize_2.default.query(`
      SELECT numero, COUNT(*) as count
      FROM operations 
      WHERE numero IS NOT NULL AND numero != ''
      GROUP BY numero 
      HAVING COUNT(*) > 1
    `, {
            type: sequelize_1.QueryTypes.SELECT,
            raw: true,
        }));
        return duplicates.length > 0;
    }
    catch (error) {
        console.error("❌ Erreur lors de la vérification des doublons:", error);
        return false;
    }
}
