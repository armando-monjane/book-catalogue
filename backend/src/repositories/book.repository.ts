import { Book } from "@prisma/client";
import prisma from "../services/prisma";
import { BookCreate } from "../models/book-create";

export const createBook = async (data: BookCreate) => {
    const book = await prisma.book.create({
        data,
        select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
        },
    });
    return book;
};

export const getAllBooks = async () => {
    const books = await prisma.book.findMany({
        where: { deleted: false },
        select: {
            id: true,
            title: true,
            isbn: true,
            author: true,
            createdAt: true,
        },
    });
    return books;
};

export const getBookById = async (id: number) => {
    const book = await prisma.book.findUnique({
        where: { id, deleted: false },
        select: { id: true, title: true, author: true, isbn: true, createdAt: true } });
    return book;
}

export const getBookByIsbn = async (isbn: string) => {
    const book = await prisma.book.findUnique({
        where: { isbn, deleted: false },
        select: { id: true, title: true, author: true, isbn: true, createdAt: true } });
    return book;
};

export const updateBook = async (id: number, data: Book) => {
    const book = await prisma.book.update({
        where: { id, deleted: false },
        data,
        select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            createdAt: true,
        },
    });
    return book;
};


export const markBookAsDeleted = async (id: number) => {
    await prisma.book.update({
        where: { id },
        data: { deletedAt: new Date(), deleted: true },
    });
};

export const deleteBook = async (id: number) => {
    await prisma.book.delete({ where: { id } });
};

export const getAllDeletedBooks = async () => {
    const books = await prisma.book.findMany({
        where: { deleted: true },
        select: {
            id: true,
            title: true,
            isbn: true,
            deletedAt: true,
        },
    });
    return books;
};

export const getDeletedBookById = async (id: number) => {
    const book = await prisma.book.findUnique({
        where: { id, deleted: true },
        select: { id: true, title: true, author: true, isbn: true, createdAt: true, deletedAt: true } });
    return book;
}

export const restoreBook = async (id: number) => {
    await prisma.book.update({
        where: { id },
        data: { deletedAt: null, deleted: false },
    });
};