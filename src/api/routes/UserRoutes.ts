import { Router } from 'express'
import UserController from '../controllers/UserController'
import auth from "../middleware/jwt"

const UserRoutes = Router()

UserRoutes.post('/register', auth, UserController.register)
UserRoutes.get('/getAll', auth, UserController.getAll)
UserRoutes.post('/login', UserController.login)
UserRoutes.delete('/delete', auth, UserController.deleteUser)
UserRoutes.put('/update', auth, UserController.updateUser)
UserRoutes.post('/validateToken', auth, UserController.validateToken)

export default UserRoutes;