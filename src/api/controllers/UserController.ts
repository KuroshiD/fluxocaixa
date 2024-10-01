import { Request, Response } from 'express'
import { UserCreationAttributes, UserLoginAttributes } from '../../types/userRequestData'
import { validateRole } from "../validations/userValidation"
import UserService from "../services/UserServices"


const UserController = {
    register: async (req: Request, res: Response) => {
        const body = req.body;

        const data: UserCreationAttributes = {
            email: body.email,
            password: body.password,
            role: validateRole(body.role) ? body.role : "common",
            username: body.username 
        }

        const newuser = await UserService.register(data)

        res.status(newuser.status).json({
            message: newuser.message,
            data: newuser.data
        })
    },
    getAll: async (req: Request, res: Response) => {
        const users = await UserService.getAll()
        res.status(200).json(users)
    },
    
    login: async(req: Request, res: Response) => {
        const data: UserLoginAttributes = {
            email: req.body.email,
            password: req.body.password
        }

        const login = await UserService.login(data);

        res.status(login.status).json(login);
    }
}

export default UserController