import express from 'express';
import bodyParser = require('body-parser');
import ExpressCors from 'cors';

const Mung = require('express-mung');
import ErrorsInterceptor from './controllers/infra/ResponseErrorsLogger';

import User from 'common/app/User';
import ExecutableBotsFactory from './bot/ExecutableBotsFactory';
import Postgresql from './dal/postgresql/Postgresql';
import PgBotsDal from './dal/postgresql/PgBotsDal';
import PgBotVersionsDal from './dal/postgresql/PgBotVersionsDal';
import BotsRepository from './bot/BotsRepository';
import BotsController from './controllers/BotsController';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(ExpressCors())

const port = 3000;
const env = process.env.NODE_ENV;

const postgresql = new Postgresql("rajje.db.elephantsql.com", "uqaihmvp", "uqaihmvp", "F8qBgGNmE0BSMT__28WkZMKvmkf9fRcT");
const botsRepository = new BotsRepository(new PgBotsDal(postgresql), new PgBotVersionsDal(postgresql));;

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

const apiRouter = express.Router()
    .use('/bots', new BotsController(botsRepository).router())
app.use('/api', apiRouter);

app.use(Mung.json(ErrorsInterceptor));

app.listen(port, () => console.log(`app listening on port ${port}!`));