import connection from "../dbStrategy/postgres.js";

export async function getRanking(req, res) {
    try {
        const { rows: data } = await connection.query(`
        SELECT users.id as id, users.name as name, SUM(links.visits) as "visitCount", COUNT(links.*) as "linkCount"
        FROM users
        LEFT JOIN links ON links."userId"=user.id
        GROUP BY user.id
        ORDER BY "visitCount" DESC
        LIMIT 10
        ;`) ;
    
        return res.send(data);
    } catch(error) {
        return res.sendStatus(500);
    }
}