import signUpSchema from "../schemas/signUpSchema.js";
import connection from "../dbStrategy/postgres.js";
import bcrypt from "bcrypt";

export async function postSignUp(req, res) {
    try {
        const newSignUp = req.body;

        // Verifica o body da requisição
        const { error } = signUpSchema.validate(newSignUp);

        if (error) {
            return res.send(error).status(422);
        }

        const doPasswordsCheck = (newSignUp.password === newSignUp.confirmPassword);

        if (doPasswordsCheck) {
            const encryptedPassword = bcrypt.hashSync(newSignUp.password, 10);

            await connection.query(`
            INSERT INTO users (
                name,
                email,
                password
            ) VALUES (
                '${newSignUp.name}',
                '${newSignUp.email}',
                '${encryptedPassword}'
            );`)
            .then(() => res.sendStatus(201))
            .catch(e => {
                if (e.code === '23505') { // Código para unique_violation
                    return res.status(409).send(e.detail);
                } else {
                    return res.sendStatus(500);
                }
            });
        } else {
            return res.send("Senhas não coincidem").status(422);
        }
    } catch(error) {
        return res.sendStatus(500);
    }
}
