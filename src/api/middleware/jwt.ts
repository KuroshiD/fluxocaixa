import { Request, Response, NextFunction } from 'express'
import { signJWT, verifyJWT } from '../utils/jwt'

interface TokenPayload {
    userId: string;
    username: string;
    iat: number;
    exp: number;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    if(!authorization)
        return res.status(401).json({ error: 'No token provided' })

    const token = authorization.replace('Bearer', '').trim()
    
    try {
        const decoded = verifyJWT(token)
        const { userId } = decoded as TokenPayload

        req.user = userId
        next()
    } catch (err) {
        return res.status(401).json({ error: 'invalid token'})
    }
}