import BasePostgresqlDal from "./BasePostgresqlDal";
import IBotsDal from "dal/IBotsDal";
import Bot from "common/app/Bot";

export default class PgBotsDal extends BasePostgresqlDal implements IBotsDal {
    private readonly SELECT_USER_BOTS = "SELECT * FROM bots WHERE owner_user_id = $1";
    private readonly SELECT_BOT_BY_ID = "SELECT * FROM bots WHERE bot_id = $1";
    private readonly SELECT_BOT_BY_NAME = "SELECT * FROM bots WHERE name = $1";
    private readonly INSERT_BOT = "INSERT INTO bots (name, owner_user_id, avatar_img_url, date_created) values ($1, $2, $3, now()) RETURNING *";
    private readonly UPDATE_BOT_ACTIVE_VERSION = "UPDATE bots SET active_version_id = $2 WHERE bot_id = $1 RETURNING *";
    private readonly DELETE_BOT = "DELETE FROM bots WHERE bot_id = $1 RETURNING *";

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

    public async getByByName(botName: string): Promise<Bot> {
        const results = await this.queryExecutor.query<Bot[]>(this.SELECT_BOT_BY_NAME, [botName]);

        if (results.length == 0) {
            return null;
        }

        return results[0];
    }

    public async createBot(name: string, ownerUserId: number, avatarImgUrl?: string): Promise<Bot> {
        const results = await this.queryExecutor.query<Bot[]>(this.INSERT_BOT, [name, ownerUserId, avatarImgUrl]);
        
        if (results.length == 0) {
            throw 'failed to create the bot';
        }

        return results[0];
    }

    public async setBotActiveVersion(botId: number, versionId: number): Promise<void> {
        const updated = await this.queryExecutor.query<Bot[]>(this.UPDATE_BOT_ACTIVE_VERSION, [botId, versionId]);
        
        if (updated.length == 0) {
            throw 'Update failed, check if: bot exists, bot version exists and that this version belongs to the bot';
        }
    }

    public async deleteBot(botId: number): Promise<void> {
        const deleted = await this.queryExecutor.query<Bot[]>(this.DELETE_BOT, [botId]);

        if (deleted.length == 0) {
            throw `Bot with id ${botId} doesnt exist`;
        }
    }
}