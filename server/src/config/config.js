module.exports = {
    port: process.env.PORT || 8081,
    db: {
        database: process.env.DB_NAME || 'travelbuddy',
        user: process.env.DB_USER || 'travelbuddy',
        password: process.env.DB_PASS || 'travelbuddy',
        options:{
            dialect: process.env.DIALECT || 'sqlite',
            host: process.env.HOST || 'localhost',
            storage: '.travelbuddy.sqlite'
        }
    }
}