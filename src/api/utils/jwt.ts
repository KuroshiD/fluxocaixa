import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from "../models/User"
import env from "../../env"

export const signJWT = (user: User): string => {
    const payload = { userId: user.id, username: user.username }

    return jwt.sign(payload, env.jwt_secret, { expiresIn: '1d' })
}

export const verifyJWT = (token: string): string | JwtPayload => 
    jwt.verify(token, env.jwt_secret)


