import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import badRequestHandler from "./middlewares/bad-request.middleware";
import { uniqueConstraintErrorHandler } from "./middlewares/prisma-errors-handler";

const port = process.env.PORT || 3000;
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

routes(app);

app.use('/api', [badRequestHandler, uniqueConstraintErrorHandler])

app.listen(port, () => {
    console.warn(`Server is running on port ${port}`);
});
