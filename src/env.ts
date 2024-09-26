import * as dotenv from "dotenv"


dotenv.config();

const getEnv = () => {
    return {
        port: process.env.PORT,
        nginx_port: process.env.NGINX_PORT, 
        db: process.env.DB,
        db_user: process.env.DB_USER,
        db_pass: process.env.DB_PASS,
        jwt_secret: process.env.JWT_SECRET
    }
}

const env = getEnv()

export default env;