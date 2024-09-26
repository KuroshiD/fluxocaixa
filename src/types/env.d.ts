
declare namespace NodeJS {
    interface ProcessEnv {
        PORT: number
        NGINX_PORT: number
        DB: string
        DB_USER: string
        DB_PASS: string
        JWT_SECRET: string
    }
}