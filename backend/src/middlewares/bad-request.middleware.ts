import { ErrorRequestHandler } from "express";
import { ValidationError } from "yup";

const badRequestHandler: ErrorRequestHandler = (err, _req, res, next) => {
    if (!(err instanceof ValidationError)) return next(err);
    
    return res.status(400).send({ message: err.message });
};

export default badRequestHandler;
