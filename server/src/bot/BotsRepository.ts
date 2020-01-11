import IBotVersionsDal from "dal/IBotVersionsDal";
import IBotsDal from "dal/IBotsDal";
import Bot from "common/app/Bot";
import BotVersion from "common/app/BotVersion";

export default class BotsRepository {
    private readonly INITIAL_CODE = "function playTurn(tableContext) {\n\t\n}\n";
    private readonly INITIAL_MESSAGE = "Just Created!";

    public constructor(private botsDal: IBotsDal, private botVersionsDal: IBotVersionsDal) {
    }

    public async createBot(botName: string, ownerUserId: number, avatarUrl?: string): Promise<Bot> {
        let bot: Bot;

        try {
            bot = await this.botsDal.createBot(botName, ownerUserId, avatarUrl);
            const firstBotVersion = await this.botVersionsDal.createBotVersion(bot.botId, this.INITIAL_CODE, this.INITIAL_MESSAGE);
            await this.botsDal.setBotActiveVersion(bot.botId, firstBotVersion.botVersionId);
            bot.activeVersionId = firstBotVersion.botVersionId;
            return bot;
        } catch (ex) {
            if (bot) {
                this.botsDal.deleteBot(bot.botId);
            }

            throw ex;
        }
    }

    public async getUserBots(userId: number): Promise<Bot[]> {
        const userBots = await this.botsDal.getUserBots(userId);

        if (userBots.length == 0) {
            return userBots;
        }

        const activeBotVersionIds = userBots.filter(bot => bot.activeVersionId).map(bot => bot.activeVersionId);
        const activeBotVersions = await this.botVersionsDal.getBotVersionsByIds(activeBotVersionIds);
        
        userBots.forEach(bot => {
            bot.activeVersion = activeBotVersions.find(version => version.botId == bot.botId);
        })

        return userBots;
    }

    public async getBotWithActiveCode(botName: string): Promise<Bot> {
        const bot = await this.botsDal.getByByName(botName);

        if (!bot) {
            throw 'Bot does not exist';
        }

        if (!bot.activeVersionId) {
            throw 'Cannot select bot code because the bot has no active version';
        }

        const botVersion = await this.getBotVersionCode(bot.activeVersionId);
        bot.activeVersion = botVersion;

        const allVersions = await this.botVersionsDal.getVersionsForBot(bot.botId);
        bot.versions = allVersions;

        return bot;
    }

    public async getBotVersionCode(versionId: number): Promise<BotVersion> {
        const botVersion = await this.botVersionsDal.getBotVersionWithCode(versionId);
        if (!botVersion) {
            throw 'Bot active version does not exist';
        }
        return botVersion;
    }

    public async createBotVersion(botId: number, code: string, message?: string): Promise<BotVersion> {
        let newVersion: BotVersion;

        try {
            newVersion = await this.botVersionsDal.createBotVersion(botId, code, message ?? '');
        } catch(ex) {
            throw ex;
        }

        try {
            const bot = await this.botsDal.setBotActiveVersion(botId, newVersion.botVersionId);
        } catch(ex) {
            this.botVersionsDal.deleteBotVersion(newVersion.botVersionId);    
            throw ex;
        }

        return newVersion;
    }

    public async deleteBotVersion(versionId: number): Promise<void> {
        const bot = await this.botsDal.getBotById(versionId);

        if (bot.activeVersionId == versionId) {
            throw "it's impossible to delete the bot's active version, please change it before";
        }
        
        await this.botVersionsDal.deleteBotVersion(versionId);
    }
}