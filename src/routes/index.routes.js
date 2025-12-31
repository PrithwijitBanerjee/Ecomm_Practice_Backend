import express from "express";
import CategoryRouter from "./category.routes.js";
import ProductRouter from "./product.routes.js";
import UserRouter from "./user.routes.js";

const RootRouter = express.Router({
    caseSensitive: true,
});

/** ... All Category related routes defined here ... **/
RootRouter
    .use("/category", CategoryRouter)

    /** ... All Product related routes defined here ... **/
    .use("/product", ProductRouter)

    /** ... All User related routes defined here ... **/
    .use("/user", UserRouter);

export default RootRouter;