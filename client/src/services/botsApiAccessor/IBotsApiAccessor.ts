import Bot from 'common/app/Bot';
import BotVersion from 'common/app/BotVersion';

export default interface IBotsApiAccessor {
    getMyBots(): Promise<Bot[]>;
    loadBotWithActiveCode(botName: string): Promise<Bot>;
    createBot(botName: string, avatarImgUrl?: string): Promise<Bot>;
    createBotVersion(botId: number, code: string, message?: string): Promise<BotVersion>;
    loadBotVersion(versionId: number): Promise<BotVersion>;
    deleteBotVersion(versionId: number): Promise<void>;
    activateBotVersion(versionId: number): Promise<BotVersion>;
}