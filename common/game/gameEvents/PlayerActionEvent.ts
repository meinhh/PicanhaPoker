import { GameEventType } from "./GameEvent"
import GameEvent from "./GameEvent";

export enum PlayerActionType {
    Fold,
    Check,
    Call,
    Raise
}

export default class PlayerActionEvent extends GameEvent {
    public playerActionType: PlayerActionType;
    public sum: number;
    public previousPlayerPot: number;
    public eventType = GameEventType.PlayerAction;
}