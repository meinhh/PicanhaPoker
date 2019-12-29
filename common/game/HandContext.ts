import Card from '../card/Card';
import { HandStage } from './HandStage';
import GameEvent from './gameEvents/GameEvent';

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
    public handFlow: GameEvent[];
    public playerStatuses: {[playerName: string]: PlayerStatus}
    public playerInvestments: {[playerName: string]: number};
}