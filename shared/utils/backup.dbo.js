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
exports.deleteOldBackups = exports.backup = void 0;
const fs = __importStar(require("fs"));
const vars_1 = require("./vars");
const sequelize_1 = __importDefault(require("./sequelize"));
const child_process_1 = require("child_process");
const fsPromises = fs.promises;
const BACKUP_DIR = "./backups/";
const RETENTION_PERIOD = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
const backup = async (unique = false) => {
    console.log("----------------Start Backup----------------", sequelize_1.default.config.database);
    try {
        // Ensure the backups directory exists
        await fsPromises.mkdir(BACKUP_DIR, { recursive: true });
        console.log(`Backup directory verified at ${BACKUP_DIR}`);
        const fileName = `backup-${(0, vars_1.getDateTime)(new Date())}.sql`;
        const filePath = `${BACKUP_DIR}${fileName}`;
        const mysqldump = (0, child_process_1.spawn)(`mysqldump`, [
            `-u ${sequelize_1.default.config.username}`,
            `-p ${sequelize_1.default.config.password}`,
            `-h ${sequelize_1.default.config.host}`,
            sequelize_1.default.config.database,
        ]);
        mysqldump.stdout.pipe(fs.createWriteStream(filePath));
        mysqldump.on("exit", async (code) => {
            if (code === 0) {
                console.log(`Backup saved successfully at ${filePath}`);
                await (0, exports.deleteOldBackups)();
            }
            else {
                console.error(`Backup failed with exit code ${code}`);
            }
        });
        mysqldump.on("error", (err) => {
            console.error("Error during backup process:", err);
        });
    }
    catch (e) {
        console.error("Error during backup operation:", e);
    }
};
exports.backup = backup;
const deleteOldBackups = async () => {
    try {
        const files = await fsPromises.readdir(BACKUP_DIR);
        const now = Date.now();
        await Promise.all(files.map(async (file) => {
            const filePath = `${BACKUP_DIR}${file}`;
            const stats = await fsPromises.stat(filePath);
            if (now - stats.birthtimeMs > RETENTION_PERIOD) {
                await fsPromises.unlink(filePath);
                console.log(`Deleted old backup: ${filePath}`);
            }
        }));
    }
    catch (err) {
        console.error("Error deleting old backups:", err);
    }
};
exports.deleteOldBackups = deleteOldBackups;
