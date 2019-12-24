import PlayerInfo from "./GamePlayerInfo";

export default class GameContext {
    public smallBlind: number;
    public bigBlind: number;
    public players: {[playerName: string]: PlayerInfo}
}