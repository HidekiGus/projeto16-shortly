import signUpSchema from "../schemas/signUpSchema.js";
import connection from "../dbStrategy/postgres.js";

// https://bootcampra.notion.site/Qua-20-07-Pr-tica-Queries-SQL-ee71c590b2a243eda721db81058b1879

export async function postSignUp(req, res) {
    try {
        const newSignUp = req.body;

        // Verifica o body da requisição
        const { error } = signUpSchema.validate(newSignUp);

        if (error) {
            return res.send(error).status(422);
        }

        // Verifica se o email existe
        const { rows: alreadyExists } = await connection.query(`
            SELECT * FROM users WHERE email='${newSignUp.email}';
        `);

        if (alreadyExists.length === 0) {
            return res.sendStatus(409);
        }
    
        


        const doPasswordsCheck = (password === passwordCheck);
        const emailUsed = await usersCollection.findOne({ email });


    } catch(error) {
        return res.sendStatus(500);
    }
}