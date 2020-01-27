import Reducer, { BasePartialReducer, supplyContext } from "../Reducer";
import { PlayersInHandResult, HandPlayersReducersFactory } from "./HandPlayersReducers";
import { BigBlindEnteredEvent, RaiseEvent, RoundOverEvent, FoldEvent, CallEvent, CheckEvent } from "../../game/Events";

interface RoundResult {
    playersLeftInRound: number;
}

class RoundReducer extends BasePartialReducer<RoundResult, PlayersInHandResult> {
    
    public intial(): RoundResult {
        return { playersLeftInRound: undefined };
    }

    protected handleBigBlindEnteredEvent(value: RoundResult, event: BigBlindEnteredEvent, context: PlayersInHandResult): RoundResult {
        return { playersLeftInRound: context.playersInHand.length };
    }
    protected handleRaiseEvent(value: RoundResult, event: RaiseEvent, context: PlayersInHandResult): RoundResult { 
        return { playersLeftInRound: context.playersInHand.length - 1 }; 
    }
    protected handleRoundOverEvent(value: RoundResult, event: RoundOverEvent, context: PlayersInHandResult): RoundResult {
        return { playersLeftInRound: context.playersInHand.length }; 
    }

    protected handleFoldEvent(value: RoundResult, event: FoldEvent): RoundResult {
        return this.complyPlay(value);
    }
    protected handleCallEvent(value: RoundResult, event: CallEvent, context: PlayersInHandResult): RoundResult { 
        return this.complyPlay(value);
    }
    protected handleCheckEvent(value: RoundResult, event: CheckEvent, context: PlayersInHandResult): RoundResult { 
        return this.complyPlay(value);
    }

    private complyPlay(current: RoundResult): RoundResult {
        return { playersLeftInRound: current.playersLeftInRound - 1 };
    }
}

export { RoundResult };
export class RoundReducersFactory{
    public static roundReducer(): Reducer<RoundResult> {
        return supplyContext(new RoundReducer(), HandPlayersReducersFactory.playersInHandReducer());
    } 
} 