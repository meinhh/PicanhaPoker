import { HandStage } from './HandStage';
import { Card } from '../card/Card';
import { GameEvent } from './gameEvents/GameEvent';

export enum PlayerStatus {
    Folded,
    Pending,
    Done
}

export class HandContext {
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