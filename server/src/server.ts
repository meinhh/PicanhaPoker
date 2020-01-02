import express from 'express';
import ExecutableBotsFactory from './bot/ExecutableBotsFactory';
import Postgresql from './dal/postgresql/Postgresql';

const app = express();
const port = 3000;
const env = process.env.NODE_ENV;

new Postgresql("rajje.db.elephantsql.com", "uqaihmvp", "uqaihmvp", "F8qBgGNmE0BSMT__28WkZMKvmkf9fRcT")
    .query("select * from users")
    .then(rows => {
        console.log(rows);
    });

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