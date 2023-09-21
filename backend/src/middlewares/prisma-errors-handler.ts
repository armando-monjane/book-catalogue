import { ErrorRequestHandler } from "express";

export const uniqueConstraintErrorHandler: ErrorRequestHandler = (
    err,
    _req,
    res,
    next
) => {
    if (err?.name !== "PrismaClientKnownRequestError")
        return next(err);

    if (err.code === "P2002") {
        return res.status(422).send({
            message: `Unique constraint failed for ${err?.meta?.target}`,
        });
    }
    return next(err);
};