import { BotVersion } from 'common';

export default interface IBotVersionsDal {
    getVersionsForBot(botId: number): Promise<BotVersion[]>;
    getBotVersion(versionId: number): Promise<BotVersion>;
    getBotVersionWithCode(versionId: number): Promise<BotVersion>;
    getBotVersionsByIds(versionIds: number[]): Promise<BotVersion[]>;
    createBotVersion(botId: number, code: string, message?: string): Promise<BotVersion>;
    deleteBotVersion(versionId: number): Promise<void>;
}