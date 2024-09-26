import { User } from "../models/User"

export const validateRole = (role: string): boolean => 
    role === 'admin' || role === 'common'

export const userAlreadyExists = async (prop: string, propName: string): Promise<User | null> =>
    await User.findOne({ where: { [propName]: prop }})