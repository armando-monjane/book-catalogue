import { Application } from "express";
import bookRouter from "./book.routes";

const routes = (app: Application) => {
    app.use("/api/books", bookRouter);
};

export default routes;