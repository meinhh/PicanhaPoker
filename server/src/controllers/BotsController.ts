import { BaseApiRouter } from "./infra/BaseApiRouter";
import { RouteAction, HttpMethod } from "./infra/RouteAction";
import BotsRepository from "bot/BotsRepository";
import { Request, Response } from "express";

export default class BotsController extends BaseApiRouter {
    public constructor(private botsRepository: BotsRepository) {
        super();
    }

    private async createBot(req: Request, res: Response) {
        const userId = 1; // Temp - change after authentication

        const {botName, avatarImg} = req.body;
    
        if (!botName) {
            res.status(403).send('Missing bot name');
        }

        try {
            const newBot = await this.botsRepository.createBot(botName, userId, avatarImg);
            res.send(newBot);
        } catch (ex) {
            res.status(500).send('Failed to create your bot');
        }
    }

    private async getMyBots(req: Request, res: Response) {
        const userId = 1; // Temp - change after authentication

        try {
            const userBots = await this.botsRepository.getUserBots(userId);
            res.status(200).json(userBots);
        } catch (ex) {
            res.status(500).send('Failed to load user bots');
        }
    }

    protected buildRoutes(): RouteAction[] {
        return [
            { method: HttpMethod.POST, path: '/', handler: this.createBot },
            { method: HttpMethod.GET, path: '/', handler: this.getMyBots }
        ]
    }
}