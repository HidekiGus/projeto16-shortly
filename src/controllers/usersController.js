import connection from "../dbStrategy/postgres.js";

export async function getUsersMe(req, res) {
    try {
        const { authorization } = req.headers;

        if (!authorization) {
            return res.sendStatus(401);
        }

        const token = authorization.replace("Bearer ", "");

        const { rows: userData } = await connection.query(`
        SELECT users.id as id, users.name as name, SUM(links.visits) as "visitCounts"
        FROM links
        JOIN users
        ON users.id=links."userId"
        JOIN sessions
        ON users.id=sessions."userId"
        WHERE sessions.token='${token}'
        GROUP BY users.id;`
        );


        const { rows: shortenedUrlsData } = await connection.query(`
        SELECT links.id as id, links."shortUrl" as "shortUrl", links."originalUrl" as "url", links.visits as "visitCount"
        FROM links
        WHERE "userId"=${userData[0].id};
        `);

        const obj = {
            ...userData[0],
            shortenedUrls: [
                ...shortenedUrlsData
            ]
        }
        return res.send(obj);
    } catch(error) {
        return res.sendStatus(500);
    }
}