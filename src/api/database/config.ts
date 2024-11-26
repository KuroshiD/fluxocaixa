import { Sequelize } from 'sequelize-typescript'
import { User } from "../models/User"
import { AuditLog } from "../models/AuditLog"
import { BalanceSummary } from "../models/BalanceSummary"
import { CashFlow } from "../models/CashFlow"
import { Product } from '../models/Products'
import { Constants } from "../models/constants"

import env from "../../env"
const {db, db_user, db_pass} = env

const models = [User, AuditLog, BalanceSummary, CashFlow, Product, Constants]

const sequelize = new Sequelize ({
    database: db,
    dialect: "postgres",
    host: "db",
    username: db_user,
    password: db_pass,
    models: models
})

export default sequelize