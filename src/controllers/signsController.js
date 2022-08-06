import signUpSchema from "../schemas/signUpSchema.js";
import connection from "../dbStrategy/postgres.js";
import bcrypt from "bcrypt";
import signInSchema from "../schemas/signInSchema.js";
import { v4 as uuid } from "uuid";

// POST signup
export async function postSignUp(req, res) {
    try {
        const newSignUp = req.body;

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
                if (e.code === '23505') { // Code for unique_violation
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

// POST /signin
export async function postSignIn(req, res) {
    try {
        const newSignIn = req.body;

        const { error } = signInSchema.validate(newSignIn);
        
        if (error) {
            return res.status(422).send(error.details[0].message);
        }

        const {rows: dataFromDb} = await connection.query(`SELECT users.password, users.id FROM users WHERE users.email='${newSignIn.email}';`);

        if (dataFromDb.length === 0) {
            return res.sendStatus(401);
        }

        const passwordFromDb = dataFromDb[0].password;
        const userIdFromDb = dataFromDb[0].id;
        const doPasswordsCheck = bcrypt.compareSync(newSignIn.password, passwordFromDb);

        if (!doPasswordsCheck) {
            return res.sendStatus(401);
        } else {
            const token = uuid();
            await connection.query(`INSERT INTO sessions (
                "userId",
                "token"
            ) VALUES (
                ${userIdFromDb},
                '${token}'
            )`);
            return res.status(200).send(token);
        }
    } catch (error) {
        return res.sendStatus(500);
    }
}