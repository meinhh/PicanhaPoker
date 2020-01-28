import { Event, EventType, PlayerJoinedHandEvent, CallEvent, RaiseEvent, FoldEvent, CheckEvent, CardsDealtEvent, FlopEvent, TurnEvent, RiverEvent, HandOverEvent, SmallBlindEnteredEvent, BigBlindEnteredEvent, RoundOverEvent, AllInEvent } from "../game/Events";
import _ from "lodash";

export default interface Reducer<T> {
    apply(value: T, event: Event): T;
    intial(): T;
}

export interface PartialReducer<T, K> extends Reducer<T> {
    apply(value: T, event: Event, context?: K): T;
}

export abstract class BasePartialReducer<T, K> implements PartialReducer<T, K> {
    public apply(value: T, event: Event, context?: K): T {
        switch(event.type) {
            case EventType.PlayerJoinedHand:
                return this.handlePlayerJoinedHandEvent(value, event as PlayerJoinedHandEvent, context);
            case EventType.CardsDealt:
                return this.handleCardsDealtEvent(value, event as CardsDealtEvent, context);
            case EventType.SmallBlindEntered:
                return this.handleSmallBlindEnteredEvent(value, event as SmallBlindEnteredEvent, context);
            case EventType.BigBlindEntered:
                return this.handleBigBlindEnteredEvent(value, event as BigBlindEnteredEvent, context);
            case EventType.Call:
                return this.handleCallEvent(value, event as CallEvent, context);
            case EventType.Check:
                return this.handleCheckEvent(value, event as CheckEvent, context);
            case EventType.Fold:
                return this.handleFoldEvent(value, event as FoldEvent, context);
            case EventType.Raise:
                return this.handleRaiseEvent(value, event as RaiseEvent, context);
            case EventType.AllIn:
                return this.handleAllInEvent(value, event as AllInEvent, context);
            case EventType.Flop:
                return this.handleFlopEvent(value, event as FlopEvent, context);
            case EventType.Turn:
                return this.handleTurnEvent(value, event as TurnEvent, context);
            case EventType.River:
                return this.handleRiverEvent(value, event as RiverEvent, context);
            case EventType.RoundOver:
                return this.handleRoundOverEvent(value, event as RoundOverEvent, context);
            case EventType.HandOver:
                return this.handleHandOverEvent(value, event as HandOverEvent, context);
        }
    }

    public abstract intial(): T;

    protected handlePlayerJoinedHandEvent(value: T, event: PlayerJoinedHandEvent, context?: K): T { return value; }
    protected handleCardsDealtEvent(value: T, event: CardsDealtEvent, context?: K): T { return value; }
    protected handleSmallBlindEnteredEvent(value: T, event: SmallBlindEnteredEvent, context?: K): T { return value; }
    protected handleBigBlindEnteredEvent(value: T, event: BigBlindEnteredEvent, context?: K): T { return value; }
    protected handleCallEvent(value: T, event: CallEvent, context?: K): T { return value; }
    protected handleCheckEvent(value: T, event: CheckEvent, context?: K): T { return value; }
    protected handleFoldEvent(value: T, event: FoldEvent, context?: K): T { return value; }
    protected handleRaiseEvent(value: T, event: RaiseEvent, context?: K): T { return value; }
    protected handleAllInEvent(value: T, event: AllInEvent, context?: K): T { return value; }
    protected handleFlopEvent(value: T, event: FlopEvent, context?: K): T { return value; }
    protected handleTurnEvent(value: T, event: TurnEvent, context?: K): T { return value; }
    protected handleRiverEvent(value: T, event: RiverEvent, context?: K): T { return value; }
    protected handleRoundOverEvent(value: T, event: RoundOverEvent, context?: K): T { return value; }
    protected handleHandOverEvent(value: T, event: HandOverEvent, context?: K): T { return value; }
}

export abstract class BaseReducer<T> extends BasePartialReducer<T, void> implements Reducer<T> { }

export type ReducerMap<T> = {
    [K in keyof T]: PartialReducer<T[K], T>
}

class CombinedReducers<T> implements Reducer<T> {
    public constructor(private readonly reducers: ReducerMap<T>) {}

    public intial(): T {
        return _.mapValues(this.reducers, reducer => reducer.intial());
    }

    public apply(value: T, event: Event): T {
        return _.chain(value).entries()
                            .map(([key, value]) => [key, this.reducers[key].apply(value[key], event, value)])
                            .fromPairs().value();
    }
}

export function combineReducers<T>(reducers: ReducerMap<T>): Reducer<T> {
    return new CombinedReducers(reducers);
}