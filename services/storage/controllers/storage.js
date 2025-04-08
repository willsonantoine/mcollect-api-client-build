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
exports.validateFileUpload = exports.convertToJpg = exports.upload = void 0;
const fs = __importStar(require("fs"));
const multer_1 = __importDefault(require("multer"));
const response_util_1 = require("../../../shared/utils/response.util");
const path_1 = __importDefault(require("path")); // Utiliser import path from 'path' pour plus de cohérence
const sharp_1 = __importDefault(require("sharp"));
// Vérifier et créer le dossier de destination si nécessaire
const uploadDirectory = "uploads/";
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
        const filename = file.fieldname +
            "-" +
            Date.now() +
            (file.mimetype.startsWith("image/") ? ".jpg" : fileExtension); // Force l'extension .jpg si c'est une image, sinon garde l'extension d'origine
        cb(null, filename);
    },
});
const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".xlsx",
    ".xls",
    ".pdf",
    ".doc",
    ".docx",
    ".csv",
];
const fileFilter = (req, file, cb) => {
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const maxFileSize = 5 * 1024 * 1024;
exports.upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: maxFileSize,
    },
});
// Middleware pour convertir les images en JPG après l'upload
const convertToJpg = async (req, res, next) => {
    if (!req.file) {
        return next(); // Passer au middleware suivant s'il n'y a pas de fichier
    }
    const filePath = path_1.default.join(__dirname, "..", "..", "..", req.file.path); // Ajustez le chemin si nécessaire
    const newFilePath = path_1.default.join(__dirname, "..", "..", "..", "uploads", path_1.default.basename(req.file.filename, path_1.default.extname(req.file.filename)) + ".jpg"); // Nouveau chemin en .jpg
    try {
        if (req.file.mimetype.startsWith("image/") &&
            !req.file.filename.endsWith(".jpg")) {
            // Convertir seulement si c'est une image et n'est pas déjà en .jpg
            await (0, sharp_1.default)(filePath)
                .jpeg({ quality: 80 }) // Vous pouvez ajuster la qualité ici
                .toFile(newFilePath);
            // Supprimer le fichier original
            fs.unlinkSync(filePath);
            // Mettre à jour les informations du fichier dans req.file
            req.file.path = "uploads/" + path_1.default.basename(newFilePath); // Mettre à jour le chemin relatif
            req.file.filename = path_1.default.basename(newFilePath);
            req.file.mimetype = "image/jpeg"; // Mettre à jour le mimetype
        }
        next(); // Passer au middleware suivant
    }
    catch (error) {
        console.error("Error converting image to JPG:", error);
        //fs.unlinkSync(filePath); // Nettoyer le fichier original en cas d'erreur seulement si on l'a converti, à voir
        return next(error); // Passer l'erreur au middleware suivant
    }
};
exports.convertToJpg = convertToJpg;
const validateFileUpload = (req, res, next) => {
    const maxSize = maxFileSize / 1024 / 1024;
    if (!req.file) {
        (0, response_util_1.setResponse)({
            res,
            message: `Aucun fichier n'a été téléchargé, veuillez vérifier les critères de téléchargement des fichiers avant d'effectuer cette action. nous prenons en charge les formats :${allowedExtensions.join(", ")}  et la taille maximun est : ${maxSize} Méga`,
            statusCode: 400,
        });
    }
    else {
        next();
    }
};
exports.validateFileUpload = validateFileUpload;
