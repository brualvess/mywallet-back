import { MongoClient, ObjectId } from "mongodb";
import joi from 'joi'
import bcrypt from 'bcrypt';
import dotenv from "dotenv";

let db;
dotenv.config()

const mongoClient = new MongoClient(process.env.MONGO_DB_URI);
mongoClient.connect().then(() => {
    db = mongoClient.db("mywallet");
});

export async function login(request, response) {
    const dadosLogin = request.body
    const schemaLogin = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required(),
    })
    const { error } = schemaLogin.validate(dadosLogin)
    if (error) {
        response.sendStatus(404)
        return;
    }
    const user = await db.collection('usuarios').findOne({ email: dadosLogin.email })
    if (!user) {
        response.sendStatus(404)
        return;
    }
    const verificaSenha = bcrypt.compareSync(dadosLogin.password, user.password)
    if (!verificaSenha) {
        response.sendStatus(401)
        return;
    }
    response.sendStatus(201)
}
export async function cadastro(request, response) {
    const { name, email, password, confirmPassword } = request.body
    const schemaCadastro = joi.object({
        name: joi.string().required(),
        email: joi.string().email().required(),
        password: joi.string().required(),
        confirmPassword: joi.ref('password')
    })
    const { error } = schemaCadastro.validate(request.body)
    if (error) {
        response.sendStatus(404)
        return;
    }
    const senhaCriptografada = bcrypt.hashSync(request.body.password, 10)
    await db.collection('usuarios').insertOne(
        {
            name: name,
            email: email,
            password: senhaCriptografada
        }
    )

    response.sendStatus(201)
}