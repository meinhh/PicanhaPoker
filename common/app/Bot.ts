import BotVersion from "./BotVersion";

export default class Bot {
    public botId: number;
    public name: string;
    public dateCreated: Date;
    public ownerUserId: number;
    public activeVersionId?: number;
    public avatarImgUrl?: string;

    public activeVersion?: BotVersion;
    public versions?: BotVersion[];
}