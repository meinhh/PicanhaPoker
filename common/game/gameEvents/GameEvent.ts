import { HandStage } from "../HandStage";

export enum GameEventType {
    HandStageProgressed,
    PlayerAction
}

export default abstract class GameEvent {
    public handStage: HandStage;
    public tablePot: number;
    public abstract eventType: GameEventType;
}