import app from "./api/app"
import env from "./env"
import sequelize from "./api/database/config"

const startServer = () => {
    sequelize.sync({ alter: true })
        .then(() => {
            console.log('Sync successful')
        })
        .catch(error => {
            console.error('Error synchronizing database:', error);
        })

        app.listen(env.port, () => {
            console.log(`Listening on port ${env.nginx_port}`)
        })
}

startServer();

