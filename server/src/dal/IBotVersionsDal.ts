import BotVersion from 'common/app/BotVersion';

export default interface IBotVersionsDal {
    getBotVersions(botId: number): Promise<BotVersion[]>;
    getBotVersion(versionId: number): Promise<BotVersion>;
    getBotVersionWithCode(versionId: number): Promise<BotVersion>;
    createBotVersion(botId: number, code: string, message?: string): Promise<BotVersion>;
    deleteBotVersion(versionId: number): Promise<void>;
}