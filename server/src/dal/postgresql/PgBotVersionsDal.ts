import BasePostgresqlDal from "./BasePostgresqlDal";
import IBotVersionsDal from "dal/IBotVersionsDal";
import BotVersion from "common/app/BotVersion";

export default class PgBotVersionsDal extends BasePostgresqlDal implements IBotVersionsDal {
    private readonly SELECT_BOT_VERSIONS = "SELECT * FROM bot_versions WHERE bot_id = $1";
    private readonly SELECT_BOT_VERSION_BY_ID = "SELECT * FROM bot_versions WHERE bot_version_id = $1";
    private readonly SELECT_BOT_VERSION_WITH_CODE = "SELECT ver.bot_version_id, ver.date_created, ver.message, ver.bot_id, cod.code FROM bot_versions ver, bot_versions_code cod WHERE ver.bot_version_id = cod.bot_version_id";
    private readonly SELECT_BOT_VERSIONS_BY_IDS = "SELECT * FROM bot_versions WHERE bot_version_id  = ANY ($1)";
    private readonly INSERT_BOT_VERSION = "INSERT INTO bot_versions (date_created, message, bot_id) values ($1, $2, $3) RETURNING *";
    private readonly INSERT_BOT_VERSION_CODE = "INSERT INTO bot_versions_code (bot_version_id, code) values ($1, $2) RETURNING *";
    private readonly DELETE_BOT_VERSION = "DELETE FROM bot_versions WHERE bot_version_id = $1";

    public async getVersionsForBot(botId: number): Promise<BotVersion[]> {
        const results = await this.queryExecutor.query<BotVersion[]>(this.SELECT_BOT_VERSIONS, [botId]);
        return results;
    }

    public async getBotVersion(versionId: number): Promise<BotVersion> {
        const results = await this.queryExecutor.query<BotVersion[]>(this.SELECT_BOT_VERSION_BY_ID);

        if (results.length == 0) {
            return null;
        }

        return results[0];
    }

    public async getBotVersionWithCode(versionId: number): Promise<BotVersion> {
        const results = await this.queryExecutor.query<BotVersion[]>(this.SELECT_BOT_VERSION_WITH_CODE);

        if (results.length == 0) {
            return null;
        }

        return results[0];
    }

    public async getBotVersionsByIds(versionIds: number[]): Promise<BotVersion[]> {
        const results = await this.queryExecutor.query<BotVersion[]>(this.SELECT_BOT_VERSIONS_BY_IDS, [versionIds]);
        return results;
    }
    
    public async createBotVersion(botId: number, code: string, message?: string): Promise<BotVersion> {
        const results = await this.queryExecutor.query<BotVersion[]>(this.INSERT_BOT_VERSION, [new Date(), message, botId]);

        if (results.length == 0) {
            throw 'Failed to create new bot version';
        }

        const botVersion = results[0];
        try {
            const insertedCode = await this.queryExecutor.query<any[]>(this.INSERT_BOT_VERSION_CODE, [botVersion.botVersionId, code]);
            
            if (insertedCode.length == 0) {
                await this.deleteBotVersion(botVersion.botVersionId) ;
                throw 'Failed to create new bot version';
            }

            botVersion.code = code;
            return botVersion;
        } catch(ex) {
            await this.deleteBotVersion(botVersion.botVersionId) ;
            throw 'Failed to create new bot version';
        }
    }

    public async deleteBotVersion(versionId: number): Promise<void> {
        return this.queryExecutor.query<void>(this.DELETE_BOT_VERSION, [versionId]);
    }
}