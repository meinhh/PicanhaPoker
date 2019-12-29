import Card from '../card/Card';
import PlayerAction from './PlayerAction'

export enum HandStage {
    PreFlop,
    Flop,
    River,
    Turn,
    Finished
}

export enum PlayerStatus {
    Folded,
    Pending,
    Done
}

export default class HandContext {
    public pot: number;
    public communityCards: Card[];
    public dealer: string;
    public smallBlindPlayer: string;
    public bigBlindPlayer: string;
    public handStage: HandStage;
    public winner: string;
    public playerActions: PlayerAction[];
    public playerStatuses: {[playerName: string]: PlayerStatus}
    public playerInvestments: {[playerName: string]: number};
}