import { PlayerInfo } from "./PlayerInfo";
import { HandContext } from "./HandContext";

export class TableContext {
    public smallBlind: number;
    public bigBlind: number;
    public players: {[playerName: string]: PlayerInfo}
    public currentPlayingHand: HandContext;
    public handsHistory: HandContext[];
}