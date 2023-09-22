import { ErrorRequestHandler } from "express";

const internalServerErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {    
    return res.status(500).send({ message: err.message });
};

export default internalServerErrorHandler;
