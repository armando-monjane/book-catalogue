import prisma from "../services/prisma";
import { BookCreate } from "../models/book-create";
import { BookUpdate } from "../models/book-update";

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

export const getAllBooks = async (skip: number, take: number, query: string, deleted: boolean = false) => {
    const [books, totalCount] = await prisma.$transaction([
        prisma.book.findMany({
            where: { deleted, title: { contains: query } },
            select: {
                id: true,
                title: true,
                isbn: true,
                author: true,
                createdAt: true,
                deletedAt: deleted,
            },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.book.count({ where: { deleted, title: { contains: query } } }),
    ]);

    return { books, totalCount };
};

export const getBookById = async (id: number) => {
    const book = await prisma.book.findUnique({
        where: { id, deleted: false },
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

export const getBookByIsbn = async (isbn: string) => {
    const book = await prisma.book.findUnique({
        where: { isbn, deleted: false },
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

export const updateBook = async (id: number, data: BookUpdate) => {
    if (data.id) delete data.id; // to avoid error when updating object having id value: Cannot update identity column 'id'

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

export const getDeletedBookById = async (id: number) => {
    const book = await prisma.book.findUnique({
        where: { id, deleted: true },
        select: {
            id: true,
            title: true,
            author: true,
            isbn: true,
            createdAt: true,
            deletedAt: true,
        },
    });
    return book;
};

export const restoreBook = async (id: number) => {
    await prisma.book.update({
        where: { id },
        data: { deletedAt: null, deleted: false },
    });
};


export const getDashboardTotals = async () => {
    const [totalInBookshelf, totalAddedCurrentMonth, totalToBeDiscarded] = await prisma.$transaction([
        prisma.book.count({ where: { deleted: false }}),
        prisma.book.count({
            where: {
                deleted: false,
                createdAt: {
                    gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                },
            },
        }),
        prisma.book.count({ where: { deleted: true }})
    ]);

    return { totalInBookshelf, totalAddedCurrentMonth, totalToBeDiscarded };
}