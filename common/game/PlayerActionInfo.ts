import { HandStage } from "./HandStage";

export enum PlayerActionType {
    Fold,
    Check,
    Call,
    Raise
}

export default class PlayerActionInfo {
    public actionType: PlayerActionType;
    public sum: number;
    public handStage: HandStage;
    public previousPotOnTable: number;
    public previousPlayerPot: number;
}