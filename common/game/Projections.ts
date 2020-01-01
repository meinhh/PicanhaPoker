import { Event, EventType, PlayerJoinedHandEvent, CallEvent, RaiseEvent, FoldEvent, CheckEvent, CardsDealtEvent, FlopEvent, TurnEvent, RiverEvent, HandOverEvent, SmallBlindEnteredEvent, BigBlindEnteredEvent, RoundOverEvent } from "./Events";
import { Seat, Table } from "./Table";
import _ from "lodash";

export abstract class Projection<T> {
    protected handledEvents: Event[];

    protected apply(hand: Event[]) {
        this.handledEvents = []; 
        for (const event of hand) {
            switch(event.type) {
                case EventType.PlayerJoinedHand:
                    this.handlePlayerJoinedHandEvent(event as PlayerJoinedHandEvent);
                    break;
                case EventType.CardsDealt:
                    this.handleCardsDealtEvent(event as CardsDealtEvent);
                    break;
                case EventType.SmallBlindEntered:
                    this.handleSmallBlindEnteredEvent(event as SmallBlindEnteredEvent);
                    break;
                case EventType.BigBlindEntered:
                    this.handleBigBlindEnteredEvent(event as BigBlindEnteredEvent);
                    break;
                case EventType.Call:
                    this.handleCallEvent(event as CallEvent);
                    break;
                case EventType.Check:
                    this.handleCheckEvent(event as CheckEvent);
                    break;
                case EventType.Fold:
                    this.handleFoldEvent(event as FoldEvent);
                    break;
                case EventType.Raise:
                    this.handleRaiseEvent(event as RaiseEvent);
                    break;
                case EventType.Flop:
                    this.handleFlopEvent(event as FlopEvent);
                    break;
                case EventType.Turn:
                    this.handleTurnEvent(event as TurnEvent);
                    break;
                case EventType.River:
                    this.handleRiverEvent(event as RiverEvent);
                    break;
                case EventType.RoundOver:
                    this.handleRoundOverEvent(event as RoundOverEvent);
                    break;
                case EventType.HandOver:
                    this.handleHandOverEvent(event as HandOverEvent);
                    break;
            }
            this.handledEvents.push(event);
        }
    }

    public abstract project(hand: Event[]): T;

    protected handlePlayerJoinedHandEvent(event: PlayerJoinedHandEvent) {}
    protected handleCardsDealtEvent(event: CardsDealtEvent) {}
    protected handleSmallBlindEnteredEvent(event: SmallBlindEnteredEvent) {}
    protected handleBigBlindEnteredEvent(event: BigBlindEnteredEvent) {}
    protected handleCallEvent(event: CallEvent) {}
    protected handleCheckEvent(event: CheckEvent) {}
    protected handleFoldEvent(event: FoldEvent) {}
    protected handleRaiseEvent(event: RaiseEvent) {}
    protected handleFlopEvent(event: FlopEvent) {}
    protected handleTurnEvent(event: TurnEvent) {}
    protected handleRiverEvent(event: RiverEvent) {}
    protected handleRoundOverEvent(event: RoundOverEvent) {}
    protected handleHandOverEvent(event: HandOverEvent) {}
}

export class PlayersProjection extends Projection<{playerId: string, seat: Seat}[]> {
    private players: {playerId: string, seat: Seat}[];

    public project(hand: Event[]): {playerId: string, seat: Seat}[] {
        this.apply(hand);
        return this.players;
    }

    protected handlePlayerJoinedHandEvent(event: PlayerJoinedHandEvent) {
        const {playerId, seat} = event;
        this.players = _.concat(this.players, [{playerId, seat}])
    }
}

export class PlayerToTalkProjection extends Projection<{playerId: string, seat: Seat}> {
    private playerToTalk: {playerId: string, seat: Seat};
    private dealer: Seat;

    public constructor(private readonly table: Table,
                       private readonly playersInHandProjection: PlayersInHandProjection) {
        super();
    }

    public project(hand: Event[]): {playerId: string, seat: Seat} {
        this.apply(hand);
        return this.playerToTalk;
    }

    protected handleCardsDealtEvent(event: CardsDealtEvent) {
        this.dealer = event.delear;
        this.playerToTalk = this.nextPlayer(this.dealer);
    }
    
    protected handleRoundOverEvent(event: RoundOverEvent) {
        this.playerToTalk = this.nextPlayer(this.dealer);
    }

    protected handleSmallBlindEnteredEvent = (event: SmallBlindEnteredEvent) => this.setPlayerToTalk();
    protected handleBigBlindEnteredEvent = (event: BigBlindEnteredEvent) => this.setPlayerToTalk();
    protected handleCheckEvent = (event: CheckEvent) => this.setPlayerToTalk();
    protected handleRaiseEvent = (event: RaiseEvent) => this.setPlayerToTalk();
    protected handleFoldEvent = (event: FoldEvent) => this.setPlayerToTalk();

    private setPlayerToTalk() {
        this.playerToTalk = this.nextPlayer(this.playerToTalk.seat)
    }

    private nextPlayer(currentPlayerSeat: Seat): {playerId: string, seat: Seat} {
        const orderedPlayers = _.sortBy(this.playersInHandProjection.project(this.handledEvents));
        const currentPlayerIndex = _.findIndex(orderedPlayers, p => p.seat === currentPlayerSeat);
        return orderedPlayers[(currentPlayerIndex + 1) % this.table.size];
    }

}

export class PlayersInHandProjection extends Projection<{playerId: string, seat: Seat}[]> {
    private players: {playerId: string, seat: Seat}[];

    public constructor(private readonly playerToTalkProjection: PlayerToTalkProjection) {
        super();
    }

    public project(hand: Event[]): {playerId: string, seat: Seat}[] {
        this.apply(hand);
        return this.players;
    }

    protected handlePlayerJoinedHandEvent(event: PlayerJoinedHandEvent) {
        const {playerId, seat} = event;
        this.players = _.concat(this.players, [{playerId, seat}])
    }

    protected handleFoldEvent(event: FoldEvent) {
        const currentPlayer = this.playerToTalkProjection.project(this.handledEvents);
        this.players = _.filter(this.players, player => player.playerId === currentPlayer.playerId)
    }
}


export class PotSizeProjection extends Projection<number> {
    private pot: number;
    private activeRaiseAmount: number;
    
    public project(hand: Event[]): number {
        this.pot = 0;
        this.activeRaiseAmount = 0;
        this.apply(hand);
        return this.pot;
    }

    protected handleSmallBlindEnteredEvent(event: SmallBlindEnteredEvent) {
        this.pot += event.amount;
    }
    
    protected handleBigBlindEnteredEvent(event: BigBlindEnteredEvent) {
        this.pot += event.amount;
        this.activeRaiseAmount = event.amount;
    }

    protected handleRaiseEvent(event: RaiseEvent) {
        this.pot += this.activeRaiseAmount + event.amount;
        this.activeRaiseAmount += event.amount;
    }
    
    protected handleCallEvent(event: CallEvent) {
        this.pot += this.activeRaiseAmount;
    }

    protected handleRoundOverEvent(event: CallEvent) {
        this.activeRaiseAmount = 0;
    }
}