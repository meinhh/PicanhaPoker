import { Seat } from "./Table";
import Card from "../card/Card";

export enum EventType {
    PlayerJoinedHand,
    CardsDealt,
    SmallBlindEntered,
    BigBlindEntered,
    Check,
    Fold,
    Call,
    Raise,
    Flop,
    Turn,
    River,
    RoundOver,
    HandOver
}

export abstract class Event {
    readonly type: EventType;
}

export class PlayerJoinedHandEvent extends Event {
    type: EventType = EventType.PlayerJoinedHand;
    playerId: string;
    stack: number;
    seat: Seat;
}

export class CardsDealtEvent extends Event { 
    type: EventType = EventType.CardsDealt;
    delear: Seat;
}

export class SmallBlindEnteredEvent extends Event { 
    type: EventType = EventType.SmallBlindEntered;
    amount: number;
}

export class BigBlindEnteredEvent extends Event { 
    type: EventType = EventType.BigBlindEntered;
    amount: number;
}

export class FoldEvent extends Event { 
    type: EventType = EventType.Fold;
}

export class CheckEvent extends Event { 
    type: EventType = EventType.Fold;
}

export class CallEvent extends Event {
    type: EventType = EventType.Call;
}

export class RaiseEvent extends Event {
    type: EventType = EventType.Raise;
    amount: number;
}

export class FlopEvent extends Event {
    type: EventType = EventType.Flop;
    cards: Card[]
}

export class TurnEvent extends Event {
    type: EventType = EventType.Turn;
    card: Card
}

export class RiverEvent extends Event {
    type: EventType = EventType.River;
    card: Card
}

export class RoundOverEvent extends Event {
    type: EventType = EventType.RoundOver;
}

export class HandOverEvent extends Event {
    type: EventType = EventType.HandOver;
}