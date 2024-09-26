import { Sequelize } from 'sequelize-typescript'
import { User } from "../models/User"

import env from "../../env"
const {db, db_user, db_pass} = env

const models = [User]

const sequelize = new Sequelize ({
    database: db,
    dialect: "postgres",
    host: "db",
    username: db_user,
    password: db_pass,
    models: models
})

export default sequelize