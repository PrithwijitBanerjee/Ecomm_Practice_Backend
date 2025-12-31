import dotenv from "dotenv";

dotenv.config(); // import dotenv external middlewares and configure it globally ...

const config = {
    app: {
        port: process.env.PORT,
        baseUrl: process.env.BASE_URL,
        apiUrl: process.env.API_URL,
        maxFileSize: process.env.MAX_FILE_SIZE_LIMIT,
        allowedFileTypes: process.env.ALLOWED_FILE_TYPES,
        jwtSecretKey: process.env.JWT_SECRET_KEY,
        smtpUserName: process.env.SMTP_USERNAME,
        smtpPass: process.env.SMTP_PASSWORD,
    },
    db: {
        dbName: process.env.DB_NAME,
        dbUrl: process.env.DB_URL,
        dbPort: process.env.DB_PORT,
    }
};

export default config;