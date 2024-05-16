import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 7000

const app = express();

app.use(express.json())

app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})

app.get('/', (req, res) => {
    return res.status(200).send({ status: "Working" })
})