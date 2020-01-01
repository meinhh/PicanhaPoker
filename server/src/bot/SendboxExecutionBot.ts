import TableContext from 'common/game/TableContext';
import IExecutableBot from './IExecutableBot';
import BotExecutionResult from './BotExecutionResult';

export default class SendboxExecutionBot implements IExecutableBot {
    constructor(private botCode: string, private sandboxInstance: any) { 
        this.formatBotCodeString();
    }

    public playTurn(tableContext: TableContext): Promise<BotExecutionResult> {
        return Promise.reject();
    }

    private formatBotCodeString() {
        this.botCode = `(${this.botCode})`;
    }
}