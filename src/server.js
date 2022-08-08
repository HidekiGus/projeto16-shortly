import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import signsRouter from "./routes/signsRouter.js";
import urlsRouter from "./routes/urlsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import rankingRouter from "./routes/rankingRouter.js";

const server = express();

dotenv.config();

server.use(cors());
server.use(express.json());

server.use(signsRouter);
server.use(urlsRouter);
server.use(usersRouter);
server.use(rankingRouter);

server.listen(process.env.PORT, () => {
    console.log("Servidor rodando na porta " + process.env.PORT + "!");
})