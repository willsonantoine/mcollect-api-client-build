"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_roles_1 = __importDefault(require("../../../shared/models/users.roles"));
const users_roles_2 = __importDefault(require("../../../shared/models/users.roles"));
const users_model_1 = __importDefault(require("../../../shared/models/users.model"));
const vars_1 = require("../../../shared/utils/vars");
const users_auth_service_1 = __importDefault(require("./users.auth.service"));
const members_service_1 = __importDefault(require("./members.service"));
const sequelize_1 = require("sequelize");
const access_users_model_1 = __importDefault(require("../../../shared/models/access.users.model"));
const access_model_1 = __importDefault(require("../../../shared/models/access.model"));
const AccessList_1 = require("../../../shared/storage/AccessList");
class UserService {
    constructor() {
        this.findAccount = async ({ username }) => {
            const find = await this.userModel.findOne({
                where: { username },
                include: [{ model: users_roles_1.default, as: "role" }],
            });
            if (!find) {
                return;
            }
            if (!find.isPasswordSecured) {
                const new_password = (0, vars_1.encryptPassword)("@User1234");
                await this.userModel.update({ password: new_password, isPasswordSecured: true }, { where: { id: find.id }, returning: true });
            }
            return find;
        };
        this.verifyPassword = async ({ password, hash, }) => {
            return await (0, vars_1.comparePassword)(password, hash);
        };
        this.login = async (user) => {
            await this.userAuthService.logOut(user.id);
            const token = await this.userAuthService.generateToken(user.id, user.role.name || "User");
            await this.userAuthService.create({ userId: user.id, token });
            return token;
        };
        this.logOut = async (userId) => {
            return this.userAuthService.logOut(userId);
        };
        this.createUser = async ({ username, password, roleId, phone, email, }) => {
            const password_encr = (0, vars_1.encryptPassword)(password);
            const user = await this.userModel.create({
                username,
                password: password_encr,
                roleId,
                isPasswordSecured: true,
                email,
                phone,
            });
            const allAccess = await this.accessModel.findAll();
            for (const access of allAccess) {
                await this.accessUser.create({ userId: user.id, accessId: access.id });
            }
        };
        this.initUser = async () => {
            try {
                const countUser = await this.userModel.count();
                if (countUser === 0) {
                    const [role] = await this.userRoleModel.findCreateFind({
                        where: {
                            name: "SuperAdmin",
                            description: "Le role SuperAdmin qui tout les privilèges",
                        },
                    });
                    const member = await this.memberService.create({
                        id: (0, vars_1.generateUniqueId)(),
                        number: (0, vars_1.generateUniqueId)(),
                        type: "Utilisateur",
                        fullname: "Super Admin",
                    });
                    await this.createUser({
                        username: "admin",
                        password: "admin",
                        roleId: role.id,
                        memberId: member.id,
                    });
                    const [role2] = await this.userRoleModel.findCreateFind({
                        where: {
                            name: "Admin",
                            description: "Le role Admin est celui qui vien apres le super admin",
                        },
                    });
                    const [role3] = await this.userRoleModel.findCreateFind({
                        where: {
                            name: "User",
                            description: "C'est l'utilisateur simple",
                        },
                    });
                }
                const countAccessList = await this.accessModel.count();
                if (countAccessList !== AccessList_1.DefaultAccessList.length) {
                    for (const access of AccessList_1.DefaultAccessList) {
                        const exist = await this.accessModel.findOne({
                            where: { name: access.name },
                        });
                        if (!exist) {
                            const countAccount = await this.accessModel.count();
                            await this.accessModel.create({
                                id: `${countAccount + 1}`,
                                name: access.name,
                                description: access.nameDescription,
                                type: access.type,
                                status: true,
                            });
                            console.log(`${access.name} created`);
                        }
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        this.getAllUsers = async ({ roleId, search, type, status, offset, limit, }) => {
            const whereTarget = {};
            if (search) {
                whereTarget[sequelize_1.Op.or] = [
                    { username: { [sequelize_1.Op.like]: `%${search}%` } },
                    { bio: { [sequelize_1.Op.like]: `%${search}%` } },
                ];
            }
            if (roleId) {
                whereTarget.roleId = roleId;
            }
            if (status) {
                whereTarget.status = status;
            }
            return this.userModel.findAndCountAll({
                where: whereTarget,
                limit: limit,
                offset: offset,
                attributes: [
                    "id",
                    "username",
                    "status",
                    "avatar",
                    "phone",
                    "email",
                    "bio",
                    "isValidator",
                    "isPasswordSecured",
                    "updatedAt",
                    "createdAt",
                ],
                include: [
                    { model: users_roles_2.default, as: "role", attributes: ["id", "name"] },
                ],
                order: [
                    ["createdAt", "desc"],
                    ["updatedAt", "desc"],
                ],
            });
        };
        this.getAccessForUser = async (userId) => {
            // 1. Fetch the user's existing access permissions.  Crucially, fetch the accessId to avoid N+1 issues.
            const listAccess = await this.accessUser.findAll({
                where: { userId },
                attributes: ["id", "createdAt", "status", "updatedAt", "accessId"], // Include accessId here!!!
                include: [
                    {
                        model: access_model_1.default,
                        as: "access",
                        attributes: ["id", "name", "type", "description"],
                        order: [["type", "asc"]],
                    },
                ],
            });
            // 2. Fetch all available access permissions.
            const countAllAccess = await this.accessModel.findAll();
            // 3.  Create missing access permissions.
            const existingAccessIds = listAccess.map((accessUser) => accessUser.accessId); // Get all existing accessIds
            const accessToCreate = countAllAccess.filter((access) => !existingAccessIds.includes(access.id));
            // 4. Bulk create the missing access permissions.  Much more efficient than creating them one at a time.
            if (accessToCreate.length > 0) {
                const newAccessUsers = accessToCreate.map((access) => ({
                    id: `${accessToCreate.length + 1}`,
                    userId: userId,
                    accessId: access.id,
                    status: true,
                    description: access.description,
                }));
                await this.accessUser.bulkCreate(newAccessUsers);
                console.log(`Added ${accessToCreate.length} new access permissions for user ${userId}`);
            }
            // 5. Re-fetch the user's access permissions to include the newly created ones.
            return await this.accessUser.findAll({
                where: { userId },
                attributes: ["id", "createdAt", "status", "updatedAt", "accessId"],
                include: [
                    {
                        model: access_model_1.default,
                        as: "access",
                        attributes: ["id", "name", "type", "description"],
                        order: [["type", "asc"]],
                    },
                ],
            });
        };
        this.setAccessToUser = async (userId, accessId, userCreatedId) => {
            const findAccess = await this.accessUser.findOne({
                where: { userId, accessId },
            });
            if (findAccess) {
                await this.accessUser.update({ status: !findAccess.status, userCreatedId: userCreatedId }, {
                    where: { id: findAccess.id },
                    returning: true,
                });
                await this.logOut(userId);
            }
            return await this.getAccessForUser(userId);
        };
        this.getRoles = async () => {
            return await this.userRoleModel.findAll({ order: [["name", "asc"]] });
        };
        this.findByUsername = async (username) => {
            return await this.userModel.findOne({ where: { username: username } });
        };
        this.updateUserInfos = async (data) => {
            return await this.userModel.update(data, {
                where: { id: data.id },
                returning: true,
            });
        };
        this.initUserPassword = async (userId) => {
            const password = (0, vars_1.generateStrongPassword)();
            const password_enc = (0, vars_1.encryptPassword)(password);
            await this.userModel.update({ password: password_enc }, { where: { id: userId }, returning: true });
            await this.logOut(userId);
            return password;
        };
        this.updateLoginInfos = async ({ username, password, id, }) => {
            return await this.userModel.update({ username, password: (0, vars_1.encryptPassword)(password) }, { where: { id }, returning: true });
        };
        this.userModel = users_model_1.default;
        this.userAuthService = new users_auth_service_1.default();
        this.userRoleModel = users_roles_2.default;
        this.memberService = new members_service_1.default();
        this.accessUser = access_users_model_1.default;
        this.accessModel = access_model_1.default;
        setTimeout(() => this.initUser().then(() => console.log("Utilisateur initialisé avec success")), 8000);
    }
}
exports.default = UserService;
