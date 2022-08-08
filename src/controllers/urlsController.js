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

// GET /urls/open/:shortUrl
export async function getUrlsRedirect(req, res) {
    try {
        const shortUrl = req.params.shortUrl;
        const { rows: shortUrlData } = await connection.query(`SELECT * FROM links WHERE "shortUrl"='${shortUrl}';`);
        if (shortUrlData.rowCount === 0) {
            return res.sendStatus(404);
        } else {
            const addVisit = shortUrlData[0].visits + 1;
            await connection.query(`UPDATE links SET visits=${addVisit} WHERE "shortUrl"='${shortUrl}';`);
            return res.redirect(shortUrlData[0].originalUrl);
        }
    } catch(error) {
        return res.sendStatus(500);
    }
}

// DELETE /urls/:id
export async function deleteUrlById(req, res) {
    try {
        const id = req.params.id;
        const { authorization } = req.headers;

        if (!authorization) { // If authorization was not sent
            return res.sendStatus(401);
        }

        const token = authorization.replace("Bearer ", "");

        const { rows: tokenData } = await connection.query(`SELECT * FROM sessions WHERE token='${token}';`);
        if (tokenData.length === 0) { //  If token was not found in sessions
            return res.sendStatus(401);
        }

        const { rows: urlData } = await connection.query(`SELECT * FROM links WHERE id=${id};`);
        if (urlData.length === 0) { // If url was not found by id
            return res.sendStatus(404);
        }

        if (tokenData[0].userId !== urlData[0].userId) { // If user that requested is different than who created
            return res.sendStatus(401);
        } 

        await connection.query(`DELETE FROM links WHERE id=${id};`);
        return res.sendStatus(204);
    } catch(error) {
        return res.sendStatus(500);
    }
}