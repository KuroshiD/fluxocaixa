import { Router } from 'express'
import UserController from '../controllers/UserController'

const UserRoutes = Router()

UserRoutes.post('/register', UserController.register)
UserRoutes.get('/getAll', UserController.getAll)

export default UserRoutes;