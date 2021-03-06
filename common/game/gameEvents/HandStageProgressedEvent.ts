import GameEvent from "./GameEvent";
import { GameEventType } from "./GameEvent"
import { HandStage } from "../HandStage";

export default class HandStageProgressedEvent extends GameEvent {
    public nextHandStage: HandStage;
    public eventType = GameEventType.HandStageProgressed;
}