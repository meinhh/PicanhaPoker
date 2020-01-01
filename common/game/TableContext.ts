import TablePlayerInfo from "./TablePlayerInfo";
import HandContext from "./HandContext";

export default class TableContext {
    public smallBlind: number;
    public bigBlind: number;
    public players: {[playerName: string]: TablePlayerInfo}
    public currentPlayingHand: HandContext;
    public handsHistory: HandContext[];
}