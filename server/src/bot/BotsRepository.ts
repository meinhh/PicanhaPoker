import IBotVersionsDal from "dal/IBotVersionsDal";
import IBotsDal from "dal/IBotsDal";
import Bot from "common/app/Bot";

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
}