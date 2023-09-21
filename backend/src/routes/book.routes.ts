import express from "express";
import {
    create,
    getAll,
    getById,
    getByIsbn,
    markAsDeleted,
    update,
    restore,
} from "../controllers/book.controller";

const bookRouter = express.Router();

bookRouter.post("/", create);
bookRouter.get("/", getAll);
bookRouter.get("/:id", getById);
bookRouter.get("/isbn/:isbn", getByIsbn);
bookRouter.delete("/:id", markAsDeleted);
bookRouter.put("/:id", update);
bookRouter.put("/restore/:id", restore);

export default bookRouter;
