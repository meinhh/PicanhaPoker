import express from 'express';
import BotRunner from './bot/BotRunner';

const app = express();
const port = 3000;
const env = process.env.NODE_ENV;

console.log("Launching on environment: " + env);

app.get('/', (req, res) => {
    res.send(BotRunner.run())
});

app.listen(port, () => console.log(`app listening on port ${port}!`));