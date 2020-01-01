import TableContext from 'common/game/TableContext';
import IExecutableBot from './IExecutableBot';
import BotExecutionResult from './BotExecutionResult';
import { PlayerActionType } from '../../../common/game/gameEvents/PlayerMoveEvent';
import PlayerMoveData from './PlayerMove';

export default class SandboxExecutableBot implements IExecutableBot {
    constructor(private botCode: string, private sandboxInstance: any) { 
    }

    public playTurn(tableContext: TableContext): Promise<BotExecutionResult> {
        return new Promise((resolve, reject) => {
            const sandboxParam = "JSON.parse('" + JSON.stringify(tableContext) + "')";
            const executableCode = this.prepareCodeToSandbox([sandboxParam]);
            this.sandboxInstance.run(executableCode, (output) => {
                try {
                    var adaptedResult = output.result.replace(/\'/g, '"');
                    const move: any = JSON.parse(adaptedResult);
                    let moveData: PlayerMoveData;

                    if (typeof(move) === 'string') {
                        try {
                            moveData = this.handleStringOutput(move);
                        } catch (ex) {
                            reject(ex);
                            return;
                        }
                    } else if (Array.isArray(move)) {
                        try {
                            moveData = this.handleArrayOutput(move);
                        } catch (ex) {
                            reject(ex);
                            return;
                        }
                    } else {
                        reject("invalid player move: bot return value must be a pair or a plain string.");
                        return;
                    }

                    resolve(new BotExecutionResult(output.console, moveData));
                } catch (ex) {
                    reject(ex);
                }
            })
        });
    }

    private prepareCodeToSandbox(params: string[]): string {
        return `(${this.botCode})(${params.join(",")})`;
    }

    private handleStringOutput(move: string): PlayerMoveData {
        const moveType: PlayerActionType = PlayerActionType[move.toUpperCase()];
                        
        if (moveType == undefined) {
            throw `invalid player move: unknown move '${move}'`;
        }
        
        if (moveType == PlayerActionType.RAISE) {
            throw "invalid player move: played raise without amount";
        }

        return new PlayerMoveData(moveType);
    }

    private handleArrayOutput(move: any[]): PlayerMoveData {
        if (move.length < 1) {
            throw `invalid player move: no move specified`;
        }

        const rawMoveType: string = move[0].toUpperCase();
        const moveType: PlayerActionType = PlayerActionType[rawMoveType];
        
        if (moveType == undefined) {
            throw `invalid player move: unknown move '${move}'`;
        }
        
        if (moveType == PlayerActionType.RAISE) {
            if (move.length < 2) {
                throw `invalid player move: missing raise amount`;
            }
            
            if (isNaN(move[1])) {
                throw `invalid player move: raise amount is not a number`;
            }

            const raiseAmount = Number(move[1]);
            const moveData = new PlayerMoveData(PlayerActionType.RAISE, raiseAmount);
            return moveData;
        } else {
            const moveData = new PlayerMoveData(moveType);
            return moveData;
        }
    }
}