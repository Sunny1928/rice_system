module.exports = {
    db: {
        HOST : 'localhost',
        USER : 'root',
        PASSWORD: '',
        PORT: '3306',
        DB: 'rice_api_db',
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
    authentication: {
        jwtSecret: process.env.JWT_SECRET || 'secret'
    }
    
}