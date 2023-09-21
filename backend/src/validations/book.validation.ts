import * as yup from "yup";

export const createBookValidation = yup.object({
    title: yup.string().required(),
    isbn: yup.string().required(),
    author: yup.string().required(),
});

export const getBookByIdValidation = yup.object({
    id: yup.number().required(),
});