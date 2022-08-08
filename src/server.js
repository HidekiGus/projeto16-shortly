import express from "express";
import cors from "cors";

import signsRouter from "./routes/signsRouter.js";
import urlsRouter from "./routes/urlsRouter.js";
import usersRouter from "./routes/usersRouter.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(signsRouter);
server.use(urlsRouter);
server.use(usersRouter);

server.listen(4000, () => {
    console.log("Servidor rodando!");
})