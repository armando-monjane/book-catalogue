import { RequestHandler } from "express";
import {
    createBook,
    getAllBooks,
    getBookById,
    getBookByIsbn,
    deleteBook,
    markBookAsDeleted,
    updateBook,
    restoreBook,
    getDeletedBookById
} from "../repositories/book.repository";
import {
    createBookValidation,
    getBookByIdValidation,
} from "../validations/book.validation";
import { BookCreate } from "../models/book-create";
import { Book } from "@prisma/client";

/**
 * POST /books
 * @summary Create a new book
 * @tags books
 * @param {BookCreate} request.body.required - Book info
 * @returns 201 - Book successfully created with json body of the book
 * @returns {Error} 400 - Bad request
 * @returns {Error} 500 - Internal Server Error
 */
export const create: RequestHandler<
    unknown,
    unknown,
    BookCreate,
    unknown
> = async (req, res, next) => {
    try {
        const data = await createBookValidation.validate(req.body);
        const book = await createBook(data);
        return res.status(201).send(book);
    } catch (err) {
        return next(err);
    }
};

/**
 * GET /books
 * @summary Get all books
 * @tags books
 * @returns 200 - Books successfully retrieved with json body of all books
 * @returns {Error} 500 - Internal Server Error
 */
export const getAll: RequestHandler = async (_, res, next) => {
    try {
        const books = await getAllBooks();
        return res.status(200).send(books);
    } catch (err) {
        return next(err);
    }
};

/**
 * GET /books/{id}
 * @summary Get book by id
 * @tags books
 * @param {number} id.path.required - Book id
 * @returns 200 - Book successfully retrieved with json body of the book
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Book not found
 * @returns {Error} 500 - Internal Server Error
 */
export const getById: RequestHandler<{ id: string }> = async (
    req,
    res,
    next
) => {
    try {
        const { id } = await getBookByIdValidation.validate(req.params);
        const book = await getBookById(id);
        if (!book) {
            return res.status(404).send({ message: "Book not found" });
        }
        return res.status(200).send(book);
    } catch (err) {
        return next(err);
    }
};

/**
 * GET /books/isbn/{isbn}
 * @summary Get book by isbn
 * @tags books
 * @param {string} isbn.path.required - Book isbn
 * @returns 200 - Book successfully retrieved with json body of the book
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Book not found
 * @returns {Error} 500 - Internal Server Error
 */
export const getByIsbn: RequestHandler<{ isbn: string }> = async (
    req,
    res,
    next
) => {
    try {
        const { isbn } = req.params;
        const book = isbn && (await getBookByIsbn(isbn));
        if (!book) {
            return res.status(404).send({ message: "Book not found" });
        }
        return res.status(200).send(book);
    } catch (err) {
        return next(err);
    }
};

/**
 * DELETE /books/{id}
 * @summary Delete book by id
 * @tags books
 * @param {number} id.path.required - Book id
 * @returns 204 - Book successfully deleted
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Book not found
 * @returns {Error} 500 - Internal Server Error
 */
export const markAsDeleted: RequestHandler<{ id: string }> = async (
    req,
    res,
    next,
) => {
    try {
        const { id } = await getBookByIdValidation.validate(req.params);
        const book = id && (await getBookById(id));
        if (!book) {
            return res.status(404).send({ message: "Book not found" });
        }

        await markBookAsDeleted(id);
        return res.status(204).send();
    } catch (err) {
        return next(err);
    }
};

/**
 * PUT /books/{id}
 * @summary Update book by id
 * @tags books
 * @param {number} id.path.required - Book id
 * @param {BookCreate} request.body.required - Book info
 * @returns 200 - Book successfully updated with json body of the book
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Book not found
 * @returns {Error} 500 - Internal Server Error
 */
export const update: RequestHandler<{ id: string }, unknown, Book> = async (
    req,
    res,
    next,
) => {
    try {
        const { id } = await getBookByIdValidation.validate(req.params);
        const book = id && (await getBookById(id));
        if (!book) {
            return res.status(404).send({ message: "Book not found" });
        }
        await createBookValidation.validate(req.body);

        const updatedBook = await updateBook(id, req.body);
        return res.status(200).send(updatedBook);
    } catch (err) {
        return next(err);
    }
};

/**
 * RESTORE /books/restore/{id}
 * @summary Restore book by id
 * @tags books
 * @param {number} id.path.required - Book id
 * @returns 200 - Book successfully restored with json body of the book
 * @returns {Error} 400 - Bad request
 * @returns {Error} 404 - Book not found
 * @returns {Error} 500 - Internal Server Error
 */
export const restore: RequestHandler<{ id: string }> = async (
    req,
    res,
    next,) => {
    try {
        const { id } = await getBookByIdValidation.validate(req.params);
        const book = id && (await getDeletedBookById(id));
        if (!book) {
            return res.status(404).send({ message: "Book not found" });
        }

        await restoreBook(id);
        return res.status(200).send(book);
    } catch (err) {
        return next(err);
    }
};