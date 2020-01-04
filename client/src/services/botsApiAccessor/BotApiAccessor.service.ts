import IBotsApiAccessor from './IBotsApiAccessor';
import Bot from '../../../../common/app/Bot';
import axios from 'axios';
import { injectable } from 'inversify-props';

@injectable()
export default class BotApiAccessorService implements IBotsApiAccessor {
    private readonly API_ENDPOINT = "http://localhost:3000/api";
    
    public constructor() {
    }

    public async getMyBots(): Promise<Bot[]> {
        const response = await axios.get<any[]>(this.API_ENDPOINT + "/bots");
        const bots = response.data.map(obj => {
            const bot: Bot = new Bot();
            bot.botId = obj.botId;
            bot.name = obj.name;
            bot.avatarImageUrl = obj.avatarImageUrl;
            bot.dateCreated = new Date(obj.dateCreated);
            bot.ownerUserId = obj.ownerUserId;
            bot.activeVersionId = obj.activeVersionId;
            bot.activeVersion = obj.activeVersion;

            return bot;
        })

        return bots;
    }
}