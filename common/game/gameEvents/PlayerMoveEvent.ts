import { GameEventType } from "./GameEvent"
import GameEvent from "./GameEvent";

export enum PlayerActionType {
    Fold,
    Check,
    Call,
    Raise
}

export default class PlayerMoveEvent extends GameEvent {
    public eventType = GameEventType.PlayerAction;
    public playerMoveType: PlayerActionType;
    public moneyAmount: number;
    public previousPlayerStack: number;
    public currentPlayerStack: number;
    public isLegalMove: boolean;
}