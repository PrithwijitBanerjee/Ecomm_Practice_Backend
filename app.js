import express from "express";
import cors from "cors";
import path from "node:path";
import CreateError from "http-errors";
import AllStatusCodes from "./src/utils/allStatusCodes.js";
import { errorResponse } from "./src/utils/response.js";
import config from "./config/config.js";
import RootRouter from "./src/routes/index.routes.js";

const app = express();

app.use(express.urlencoded({
    extended: true,
})); // for web clients ...

app.use(express.json()); // for hybrid clients web as well as mobile ...

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 86400,
}));

app.use(express.static(path.join(process.cwd(), "public")));


app.get("/", (_, res) => {
    res.status(AllStatusCodes.OK).json({
        success: true,
        message: "Welcome to the ecommerce rest apis....",
    });
});


app.use(config.app.apiUrl, RootRouter);

app.get((req, res, next) => {
    next(CreateError(AllStatusCodes.NotFound, "This route does not exist!!!"));
});

app.use((error, req, res, next) => {
    if (req.headersSent) {
        next(error);
    } else {        
        errorResponse(res, {
            status: error?.status || AllStatusCodes.InternalServerError,
            message: error?.message || "Internal Server Error!!!",
        });
    }
});

export default app;
