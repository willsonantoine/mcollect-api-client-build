"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_service_1 = __importDefault(require("../services/users.service"));
const response_util_1 = require("../../../shared/utils/response.util");
const vars_1 = require("../../../shared/utils/vars");
const otp_service_1 = __importDefault(require("../services/otp.service"));
const message_service_1 = __importDefault(require("../../messages/services/message.service"));
const constant_1 = require("../../../shared/utils/constant");
class UserController {
    constructor() {
        this.create = async (req, res) => {
            try {
                const { name, phone, email, gender, address, password } = req.body;
                if (email) {
                    if (!(0, vars_1.isEmail)(email)) {
                        (0, response_util_1.setResponse)({
                            res,
                            message: `Cette addresse email n'est pas valide`,
                            statusCode: 400,
                        });
                        return;
                    }
                    const existByEmail = await this.userService.findByEmail(email);
                    if (existByEmail) {
                        (0, response_util_1.setResponse)({
                            res,
                            message: `Cette addresse email est déja utilisé`,
                            statusCode: 400,
                        });
                        return;
                    }
                }
                if (!phone) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce numéro de télephone est invalide`,
                        statusCode: 400,
                    });
                    return;
                }
                const existByPhone = await this.userService.findByPhone(phone);
                if (existByPhone) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce numéro de télephone est déja utilisé`,
                        statusCode: 400,
                    });
                    return;
                }
                const roleId = await this.userService.getRoleId("user");
                const user = await this.userService.createUser({
                    username: name,
                    phone,
                    email,
                    roleId,
                    password,
                });
                const otp = await this.otpService.create(user.id);
                await this.messageService.send({
                    message: `Bonjour votre compte a ete creer avec success voici votre code de verification:${otp.code}. expire dans : ${(0, vars_1.getTimeDifferenceString)(otp.expireAt)}`,
                    phone,
                    userCreatedId: user.id,
                });
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 200,
                    data: { id: user.id || "", otp: constant_1.ENV_MODE === "dev" ? otp.code : "" },
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
        this.resendOtp = async (req, res) => {
            try {
                const { phone } = req.params;
                if (!phone) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce numéro de télephone est invalide`,
                        statusCode: 400,
                    });
                    return;
                }
                const existByPhone = await this.userService.findByPhone(phone);
                if (!existByPhone) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce numéro de télephone n'est pas utilisé`,
                        statusCode: 400,
                    });
                    return;
                }
                const otp = await this.otpService.create(existByPhone.id);
                await this.messageService.send({
                    message: `Bonjour votre code de verification est:${otp.code}. expire dans : ${(0, vars_1.getTimeDifferenceString)(otp.expireAt)}`,
                    phone,
                    userCreatedId: existByPhone.id,
                });
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 200,
                    data: {
                        id: existByPhone.id || "",
                        otp: constant_1.ENV_MODE === "dev" ? otp.code : "",
                    },
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
        this.verifyOtp = async (req, res) => {
            try {
                const { otp, phone } = req.body;
                if (!phone) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce numéro de télephone est invalide`,
                        statusCode: 400,
                    });
                    return;
                }
                const existByPhone = await this.userService.findByPhone(phone);
                if (!existByPhone) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce numéro de télephone n'est pas utilisé`,
                        statusCode: 400,
                    });
                    return;
                }
                const existOtp = await this.otpService.findByCode(otp);
                if (!existOtp) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce code de verification n'est pas valide`,
                        statusCode: 400,
                    });
                    return;
                }
                if (existOtp.status) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce code de verification a été utilisé`,
                        statusCode: 400,
                    });
                    return;
                }
                if (existOtp.userId !== existByPhone.id) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce code de verification n'est pas valide`,
                        statusCode: 400,
                    });
                    return;
                }
                if (existOtp.expireAt < new Date()) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce code de verification a expiré`,
                        statusCode: 400,
                    });
                    return;
                }
                await this.userService.setUserVerify(existByPhone.id);
                await this.otpService.setVerify(existOtp.id);
                const CurrentToken = await this.userService.login(existByPhone);
                (0, response_util_1.setResponse)({
                    res,
                    data: {
                        user: {
                            id: existByPhone.id,
                            role: existByPhone.role.name,
                            avatar: existByPhone.avatar,
                            username: existByPhone.username,
                            balance_sms: 0,
                        },
                        token: CurrentToken,
                    },
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
        this.login = async (req, res) => {
            try {
                const { username, password } = req.body;
                let response = await this.userService.findAccount({ username });
                if (!response) {
                    response = await this.userService.findAccountWithPhone({
                        phone: username,
                    });
                    if (!response) {
                        (0, response_util_1.setResponse)({
                            res,
                            message: `Votre nom d'utilisateur ou email n'est pas associé à un compte`,
                            statusCode: 404,
                        });
                        return;
                    }
                }
                // console.log(response, username);
                if (!response) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Le compte n'existe pas`,
                        statusCode: 404,
                    });
                    return;
                }
                const isPasswordValid = await this.userService.verifyPassword({
                    password,
                    hash: (response === null || response === void 0 ? void 0 : response.password) || "",
                });
                if (!isPasswordValid) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Le mot de passe est incorrect`,
                        statusCode: 400,
                    });
                    return;
                }
                const CurrentToken = await this.userService.login(response);
                (0, response_util_1.setResponse)({
                    res,
                    data: {
                        user: {
                            id: response.id,
                            role: response.role.name,
                            avatar: response.avatar,
                            username: response.username,
                            balance_sms: 0,
                        },
                        token: CurrentToken,
                    },
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
        this.recoverPassword = async (req, res) => {
            try {
                const { phone } = req.body;
                const findPyPhone = await this.userService.findByPhone(phone);
                if (!findPyPhone) {
                    (0, response_util_1.setResponse)({
                        res,
                        message: `Ce numéro de télephone n'est pas utilisé`,
                        statusCode: 400,
                    });
                    return;
                }
                const password = (0, vars_1.generateStrongPassword)();
                await this.userService.setPassword(findPyPhone.id, password);
                await this.messageService.send({
                    message: `Bonjour voici votre nouveau mot de passe : ${password} . si vous n'ete pas a l'origine veuillez contacter l'administrateur`,
                    phone,
                    userCreatedId: findPyPhone.id,
                });
                (0, response_util_1.setResponse)({
                    res,
                    statusCode: 200,
                    message: "Un nouveau mot de passe a été envoyer à votre numéro de télephone",
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
        this.logOut = async (req, res) => {
            const userId = req.user.id;
            try {
                const response = await this.userService.logOut(userId);
                (0, response_util_1.setResponse)({ res, data: response, message: `Déconnecter réussie` });
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
        this.getUsers = async (req, res) => {
            try {
                const { search = "", type = "", roleId = "" } = req.query;
                const { limit, offset } = (0, vars_1.pagination)(req);
                const result = await this.userService.getAllUsers({
                    roleId,
                    search,
                    type,
                    limit,
                    offset,
                });
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
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
        this.getAccess = async (req, res) => {
            try {
                const userId = req.params.userId;
                const result = await this.userService.getAccessForUser(userId);
                (0, response_util_1.setResponse)({
                    res,
                    data: result,
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
        this.addAccessToUser = async (req, res) => {
            try {
                const { userId, id } = req.params;
                const userCreatedId = req.user.id;
                const result = await this.userService.setAccessToUser(userId, id, userCreatedId);
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.initPassword = async (req, res) => {
            try {
                const userId = req.params.userId;
                const result = await this.userService.initUserPassword(userId);
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.getAllRoles = async (req, res) => {
            try {
                const result = await this.userService.getRoles();
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.updateUserData = async (req, res) => {
            try {
                const { username, roleId, phone, email } = req.body;
                const userId = req.params.id;
                const exist = await this.userService.findByUsername(username);
                if (exist && exist.id !== userId) {
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 400,
                        message: `Désolé ce nom d'utilisateur est déja utilisé par une autre utilsateur`,
                    });
                    return;
                }
                const result = await this.userService.updateUserInfos({
                    roleId,
                    username,
                    phone,
                    email,
                    id: userId,
                });
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.createData = async (req, res) => {
            try {
                const { username, roleId, phone, email } = req.body;
                const userId = req.params.id;
                const exist = await this.userService.findByUsername(username);
                if (exist) {
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 400,
                        message: `Désolé ce nom d'utilisateur est déja utilisé par une autre utilsateur`,
                    });
                    return;
                }
                const password = (0, vars_1.encryptPassword)("@User1234");
                const result = await this.userService.createUser({
                    roleId,
                    username,
                    phone,
                    email,
                    id: userId,
                    password,
                });
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.changeLoginInfos = async (req, res) => {
            try {
                const userId = req.user.id;
                const { username, password, oldPassword, confirmPassword } = req.body;
                if (!(0, vars_1.isStrongPassword)(password)) {
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 400,
                        message: `Ce mot de passe n'est pas securisé. il doit contenir un caractere special, un chiffre et une lettre majuscule`,
                    });
                    return;
                }
                if (password !== confirmPassword) {
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 400,
                        message: `Les deux mot de passe ne sont pas identiquent`,
                    });
                    return;
                }
                const existName = await this.userService.findByUsername(username);
                if (existName && existName.id !== userId) {
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 400,
                        message: `Désolé ce nom d'utilisateur n'est pas disponible`,
                    });
                    return;
                }
                const verifyPassword = await this.userService.verifyPassword({
                    password: oldPassword,
                    hash: (existName === null || existName === void 0 ? void 0 : existName.password) || "",
                });
                if (!verifyPassword) {
                    (0, response_util_1.setResponse)({
                        res,
                        statusCode: 400,
                        message: `L'ancien mot de passe n'est pas correct`,
                    });
                    return;
                }
                const result = await this.userService.updateLoginInfos({
                    password,
                    username,
                    id: userId,
                });
                (0, response_util_1.setResponse)({ res, data: result });
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
        this.userService = new users_service_1.default();
        this.otpService = new otp_service_1.default();
        this.messageService = new message_service_1.default();
    }
}
exports.default = new UserController();
