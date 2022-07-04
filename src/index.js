import express, { json } from "express";
import cors from "cors";
import dotenv from "dotenv";
import {login, cadastro} from './controllers.js';

dotenv.config()

const app = express();
app.use(json());
app.use(cors());

app.post("/login", login)
app.post("/cadastro", cadastro);


app.listen(5000)
