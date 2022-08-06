import express from "express";
import cors from "cors";

import signsRouter from "./routes/signsRouter.js";

const server = express();

server.use(cors());
server.use(express.json());

server.use(signsRouter);

server.listen(4000, () => {
    console.log("Servidor rodando!");
})