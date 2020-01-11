import IBotsApiAccessor from './IBotsApiAccessor';
import Bot from '../../../../common/app/Bot';
import axios from 'axios';
import { injectable } from 'inversify-props';
import BotVersion from 'common/app/BotVersion';

@injectable()
export default class BotApiAccessorService implements IBotsApiAccessor {
    private readonly API_ENDPOINT = "http://localhost:3000/api";
    
    public constructor() {
    }

    public async getMyBots(): Promise<Bot[]> {
        const response = await axios.get<any[]>(this.API_ENDPOINT + "/bots");
        const bots = response.data.map(this.parseBot)
        return bots;
    }

    public async createBot(botName: string, avatarImageUrl?: string): Promise<Bot> {
        const response = await axios.post<any>(this.API_ENDPOINT + "/bots", {
            botName: botName,
            avatarImg: avatarImageUrl
        });

        const asBot = this.parseBot(response.data);
        return asBot;
    }

    public async loadBotWithActiveCode(botName: string): Promise<Bot> {
        const response = await axios.get<any>(this.API_ENDPOINT + "/bots/" + botName + "/code");
        const asBot = this.parseBot(response.data);
        return asBot;
    }

    public async createBotVersion(botId: number, code: string, message?: string): Promise<BotVersion> {
        const response = await axios.post<BotVersion>(this.API_ENDPOINT + "/bots/version", {
            botId: botId,
            code: code,
            message: message
        });
        
        return response.data;
    }

    public async loadBotVersion(versionId: number): Promise<BotVersion> {
        const response = await axios.get<BotVersion>(this.API_ENDPOINT + "/bots/version/" + versionId + "/code");
        return response.data;
    }

    public async deleteBotVersion(verisonId: number): Promise<void> {
        await axios.delete(this.API_ENDPOINT + "/bots/version/" + verisonId);
    }

    public async activateBotVersion(botVersionId: number) {
        const response = await axios.put(this.API_ENDPOINT + "/bots/version/activate", {
            versionId: botVersionId
        });
        return response.data;
    }

    private parseBot(obj: any): Bot {
        const bot: Bot = new Bot();
        bot.botId = obj.botId;
        bot.name = obj.name;
        bot.avatarImgUrl = obj.avatarImgUrl;
        bot.dateCreated = new Date(obj.dateCreated);
        bot.ownerUserId = obj.ownerUserId;
        bot.activeVersionId = obj.activeVersionId;
        bot.activeVersion = obj.activeVersion;
        bot.versions = obj.versions;

        return bot;
    }
}