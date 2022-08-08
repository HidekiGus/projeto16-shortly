import connection from "../dbStrategy/postgres.js";
import { nanoid } from "nanoid";
import joi from "joi";


// POST /urls/shorten
export async function postUrlsShorten(req, res) {
    try {
        const { authorization } = req.headers;
        const { url: longUrl } = req.body;

        if (!authorization) { // If the authorization header is absent

            return res.status(422).send("Authorization não enviado");

        } else { // If the authorization is present

            const urlSchema = joi.object({ // Checks the req body
                url: joi.string().uri().required()
            });

            const { error } = urlSchema.validate(req.body);

            if (error) { // If url is absent
                return res.status(422).send("Erro na url");

            } else { // If url and authorization are presents
                const token = authorization.replace("Bearer ", "");

                const { rows: userData } = await connection.query(`SELECT * FROM sessions WHERE token='${token}';`);

                if (userData.length === 0) { // If userId was not found using token
                    return res.sendStatus(401);
                } else { // If userId was found using token
                    const shortUrlCode = nanoid(6);
                    await connection.query(`INSERT INTO links (
                            "originalUrl",
                            "shortUrl",
                            "userId"
                        ) VALUES (
                            '${longUrl}',
                            '${shortUrlCode}',
                            '${userData[0].userId}'
                    );`);
                    const responseBody = {shortUrl: shortUrlCode}; 
                    return res.send(responseBody).status(201);
                }
            }
        }     
    } catch(error) {
        console.log(error);
        return res.sendStatus(500);
    }
}

// GET /urls/:id
export async function getUrlsId(req, res) {
    try {
        const id = req.params.id;
        const { rows: data } = await connection.query(`SELECT * FROM links WHERE id=${id};`);

        if (data.length === 0 ) { // If link was not found using id
            return res.sendStatus(404);
        } else { // If link was found
            delete data[0].visits;
            delete data[0].userId;
            delete data[0].createdAt;
            res.send(data).status(200);
        }
    } catch(error) {
        return res.sendStatus(500);
    }
}