import bcrypt from "bcrypt"
import { mandatoryFieldsValidation } from "../validations/generalValidation"
import ServiceReturn from "../../types/serviceReturn"
import { userAlreadyExists } from "../validations/userValidation"
import { User } from "../models/User"
import { UserCreationAttributes, UserLoginAttributes } from "../../types/userRequestData"
import { signJWT } from "../utils/jwt"

const UserServices = {
    register: async (data: UserCreationAttributes): Promise<ServiceReturn> => {
        const requiredFields = ["username", "password", "email", "role"]
        const missingFields = mandatoryFieldsValidation(data, requiredFields)

        if (!missingFields.isValid) {
            return {
                data: missingFields.missingFields,
                message: "missing required fields",
                status: 422,
            }
        }

        if (await userAlreadyExists(data.username, "username") !== null || await userAlreadyExists(data.email, "email") !== null) {
            return {
                message: "User already exists",
                status: 409,
            }
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)
        data.password = hashedPassword

        const result = await User.create(data as any)

        if (!result)
            return {
                message: "User creation failed",
                status: 500,
            }

        return {
            data: {
                id: result.id,
                data: result.username
            },
            message: "User registered Sucessfully",
            status: 201
        }
    },
    getAll: async (): Promise<User[]> =>
        await User.findAll(),

    login: async (data: UserLoginAttributes): Promise<ServiceReturn> => {
        const requiredFields = ["email", "password"]
        const missingFields = mandatoryFieldsValidation(data, requiredFields)

        if (!missingFields.isValid)
            return {
                data: missingFields.missingFields,
                message: "Missing required fields",
                status: 422
            }

        const user = await User.scope('withPassword').findOne({ where: { email: data.email } });
        if (!user)
            return {
                message: "User not found",
                status: 401
            }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);
        if (!isPasswordValid)
            return {
                message: "User not found",
                status: 401,
            }

        return {
            data: {
                id: user.id,
                username: user.username,
                role: user.role,
                jwt: signJWT(user)
            },
            message: "Login Successful",
            status: 200
        }
    },

    delete: async (id: string): Promise<ServiceReturn> => {
        const user = await User.findByPk(id);

        if (!user) {
            return {
                message: "User not found",
                status: 404,
            };
        }

        await user.destroy();

        return {
            message: "User deleted successfully",
            status: 200,
        };
    },

    update: async (id: string, data: { atualPassword: string, newUsername?: string, newPassword: string }): Promise<ServiceReturn> => {

        const requiredFields = ["atualPassword", "newPassword"]
        const missingFields = mandatoryFieldsValidation(data, requiredFields)

        if (!missingFields.isValid)
            return {
                data: missingFields.missingFields,
                message: "Missing required fields",
                status: 422
            }

        const user = await User.scope('withPassword').findByPk(id);

        if (!user) {
            return {
                message: "User not found",
                status: 404,
            };
        }

        const isPasswordValid = await bcrypt.compare(data.atualPassword, user.password);
        if (!isPasswordValid) {
            return {
                message: "Current password is incorrect",
                status: 401,
            };
        }

        if (data.newUsername) {
            user.username = data.newUsername;
        }

        if (data.newPassword) {
            user.password = await bcrypt.hash(data.newPassword, 10);
        }

        await user.save();

        return {
            message: "User updated successfully",
            status: 200,
            data: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        };
    }
}

export default UserServices