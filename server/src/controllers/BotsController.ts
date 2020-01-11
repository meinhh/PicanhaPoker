import { BaseApiRouter } from "./infra/BaseApiRouter";
import { RouteAction, HttpMethod } from "./infra/RouteAction";
import BotsRepository from "bot/BotsRepository";
import { Request, Response } from "express";

export default class BotsController extends BaseApiRouter {
    private readonly userId = 1; // Temp - change after authentication

    public constructor(private botsRepository: BotsRepository) {
        super();
    }

    private async createBot(req: Request, res: Response) {

        const {botName, avatarImg} = req.body;
    
        if (!botName) {
            res.status(403).send('Missing bot name');
        }

        try {
            const newBot = await this.botsRepository.createBot(botName, this.userId, avatarImg);
            res.send(newBot);
        } catch (ex) {
            res.status(500).send('Failed to create your bot');
        }
    }

    private async getMyBots(req: Request, res: Response) {
        try {
            const userBots = await this.botsRepository.getUserBots(this.userId);
            res.status(200).json(userBots);
        } catch (ex) {
            res.status(500).send('Failed to load user bots');
        }
    }

    private async getBotWithCode(req: Request, res: Response) {
        try {
            const botName = req.params.botName;
            const bot = await this.botsRepository.getBotWithActiveCode(botName);
            res.status(200).json(bot);
        } catch (ex) {
            res.status(500).send('Failed to load bot');
        }
    }

    private async createBotVersion(req: Request, res: Response) {
        try {
            const botId = Number(req.body.botId);
            const {code, message} = req.body;

            const version = await this.botsRepository.createBotVersion(botId, code, message);
            res.status(200).json(version);
        } catch(ex) {
            res.status(500).send('Failed to create new bot version');
        }
    }

    private async getBotVersionCode(req: Request, res: Response) {
        try {
            const versionId = Number(req.params.versionId);
            const version = await this.botsRepository.getBotVersionCode(versionId);
            res.status(200).json(version);
        } catch(ex) {
            res.status(500).send('Failed to fetch version');
        }
    }

    private async deleteBotVersion(req: Request, res: Response) {
        try {
            const verisonId = Number(req.params.versionId);
            await this.botsRepository.deleteBotVersion(verisonId);
            res.status(200).send();
        } catch(ex) {
            res.status(500).send('failed to delete bot version id');
        }
    }

    private async activateBotVersion(req: Request, res: Response) {
        try {
            const versionId = Number(req.body.versionId);

            if (isNaN(versionId)) {
                res.status(403).send("invalid version id");
            }

            const version = await this.botsRepository.activateBotVersion(versionId);
            res.status(200).json(version);
        } catch(ex) {
            console.error(ex);
            res.status(500).send('failed to activate version');
        }
    }

    protected buildRoutes(): RouteAction[] {
        return [
            { method: HttpMethod.GET, path: '/', handler: this.getMyBots },
            { method: HttpMethod.GET, path: '/:botName/code', handler: this.getBotWithCode },
            { method: HttpMethod.POST, path: '/', handler: this.createBot },
            { method: HttpMethod.GET, path: '/version/:versionId/code', handler: this.getBotVersionCode },
            { method: HttpMethod.PUT, path: '/version/activate', handler: this.activateBotVersion },
            { method: HttpMethod.POST, path: '/version', handler: this.createBotVersion },
            { method: HttpMethod.DELETE, path: '/version/:versionId', handler: this.deleteBotVersion }
        ]
    }
}