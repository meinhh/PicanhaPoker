import TableContext from "common/game/TableContext";
import BotExecutionResult from "./BotExecutionResult";

export default interface IExecutableBot {
    playTurn(tableContext: TableContext): Promise<BotExecutionResult>;
}