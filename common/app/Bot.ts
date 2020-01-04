import { BotVersion } from "./BotVersion";

export class Bot {
    public botId: number;
    public name: string;
    public dateCreated: Date;
    public ownerUserId: number;
    public activeVersionId?: number;
    public avatarImageUrl?: string;

    public activeVersion?: BotVersion;
}