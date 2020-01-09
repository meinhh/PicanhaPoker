import Bot from 'common/app/Bot';

export default interface IBotsApiAccessor {
    getMyBots(): Promise<Bot[]>;
    createBot(botName: string, avatarImgUrl?: string): Promise<Bot>;
}