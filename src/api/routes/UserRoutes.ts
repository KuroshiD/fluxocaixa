import { Router } from 'express'
import UserController from '../controllers/UserController'

const UserRoutes = Router()

UserRoutes.post('/register', UserController.register)
UserRoutes.get('/getAll', UserController.getAll)
UserRoutes.post('/login', UserController.login)
UserRoutes.delete('/delete', UserController.deleteUser)
UserRoutes.put('/update', UserController.updateUser)

export default UserRoutes;