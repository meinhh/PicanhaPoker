import express from 'express';
import ExecutableBotsFactory from './bot/ExecutableBotsFactory';

const app = express();
const port = 3000;
const env = process.env.NODE_ENV;

console.log("Launching on environment: " + env);

app.get('/:cmd', (req, res) => {
    new ExecutableBotsFactory()
        .createSandboxBot('function(name) { print(name.first); return ' + req.params.cmd + '; }')
        .playTurn({first:"shalom"} as any)
        .then(r => {
            console.log(r);
            res.send(r);
        }).catch(err => res.status(500).send(err));
});

app.listen(port, () => console.log(`app listening on port ${port}!`));