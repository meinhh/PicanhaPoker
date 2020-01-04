import { TableContext } from "common";
import BotExecutionResult from "./BotExecutionResult";

export default interface IExecutableBot {
    playTurn(tableContext: TableContext): Promise<BotExecutionResult>;
}