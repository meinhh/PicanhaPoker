import Bot from 'common/app/Bot';

export default interface IBotsDal {
    getUserBots(userId: number): Promise<Bot[]>;
    getBotById(botId: number): Promise<Bot>;
    createBot(name: string, ownerUserId: number, avatarImgUrl?: string): Promise<Bot>;
}