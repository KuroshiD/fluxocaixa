import bcrypt from "bcrypt"
import { mandatoryFieldsValidation } from "../validations/generalValidation"
import ServiceReturn from "../../types/serviceReturn"
import { userAlreadyExists } from "../validations/userValidation"
import { User } from "../models/User"
import { UserCreationAttributes } from "../../types/userRequestData"





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
        await User.findAll()

}

export default UserServices