import IBotsApiAccessor from './IBotsApiAccessor';
import Bot from 'common/app/Bot';
import axios from 'axios';
import { injectable } from 'inversify-props';

@injectable()
export default class BotApiAccessorService implements IBotsApiAccessor {
    private readonly API_ENDPOINT = "http://localhost:3000/api";
    
    public constructor() {
    }

    public async getMyBots(): Promise<Bot[]> {
        const response = await axios.get<Bot[]>(this.API_ENDPOINT + "/bots");
        return response.data;
    }
}