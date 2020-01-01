import PlayerMoveData from "./PlayerMove";

export default class BotExecutionResult {
    public constructor(public logs: string[], public move: PlayerMoveData) {
    }
}