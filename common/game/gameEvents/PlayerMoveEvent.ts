import { GameEventType } from "./GameEvent"
import { GameEvent } from "./GameEvent";

export enum PlayerActionType {
    FOLD = 0,
    CHECK = 1,
    CALL = 2,
    RAISE = 3
}

export class PlayerMoveEvent extends GameEvent {
    public eventType = GameEventType.PlayerAction;
    public playerMoveType: PlayerActionType;
    public moneyAmount: number;
    public previousPlayerStack: number;
    public currentPlayerStack: number;
    public isLegalMove: boolean;
}