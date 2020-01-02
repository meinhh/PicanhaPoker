import BasePostgresqlDal from "./BasePostgresqlDal";
import IBotsDal from "dal/IBotsDal";
import Bot from "common/app/Bot";

export default class PgBotsDal extends BasePostgresqlDal implements IBotsDal {
    private readonly SELECT_USER_BOTS = "SELECT * FROM bots WHERE owner_user_id = $1";
    private readonly SELECT_BOT_BY_ID = "SELECT * FROM bots WHERE bot_id = $1";
    private readonly INSERT_BOT = "INSERT INTO bots (name, owner_user_id, avatar_img_url) values ($1, $2, $3) RETURNING *";

    public async getUserBots(userId: number): Promise<Bot[]> {
        const results = await this.queryExecutor.query<Bot[]>(this.SELECT_USER_BOTS, [userId]);
        return results;
    }

    public async getBotById(botId: number): Promise<Bot> {
        const results = await this.queryExecutor.query<Bot[]>(this.SELECT_BOT_BY_ID, [botId])
        
        if (results.length == 0) {
            return null;
        }

        return results[0];
    }

    public async createBot(name: string, ownerUserId: number, avatarImgUrl?: string): Promise<Bot> {
        const createdBot = await this.queryExecutor.query<Bot>(this.INSERT_BOT, [name, ownerUserId, avatarImgUrl]);
        return createdBot;
    }
}