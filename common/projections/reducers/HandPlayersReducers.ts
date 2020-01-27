import { Seat } from "../../game/Table";
import Reducer, { BasePartialReducer, combineReducers, PartialReducer } from "../Reducer";
import { PlayerJoinedHandEvent, RaiseEvent, FoldEvent, CheckEvent, CardsDealtEvent, HandOverEvent, SmallBlindEnteredEvent, BigBlindEnteredEvent, AllInEvent } from "../../game/Events";
import _ from "lodash";

interface PlayerToTalk {
    value: {playerId: string, seat: Seat};
}

type PlayerToTalkResult = { playerToTalk: PlayerToTalk; }

class PlayerToTalkContext implements PlayerToTalk  {
    value: {playerId: string, seat: Seat};
    dealer: Seat;
}

class PlayerToTalkReducer extends BasePartialReducer<PlayerToTalkContext, AllInPlayersResult & PlayersInHandResult> {

    public intial(): PlayerToTalkContext { return { value: undefined, dealer: undefined }; }

    protected handleCardsDealtEvent(current: PlayerToTalkContext, event: CardsDealtEvent, context: AllInPlayersResult & PlayersInHandResult): PlayerToTalkContext {
        const dealer = event.delear;
        return this.nextPlayer(dealer, dealer, context);
    }
    
    protected handleRoundOverEvent(current: PlayerToTalkContext, event: HandOverEvent, context: AllInPlayersResult & PlayersInHandResult): PlayerToTalkContext {
        return this.nextPlayer(current.dealer, current.dealer, context);
    }

    protected handleSmallBlindEnteredEvent = (current: PlayerToTalkContext, event: SmallBlindEnteredEvent, context: AllInPlayersResult & PlayersInHandResult) => this.nextPlayer(current.value.seat, current.dealer, context);
    protected handleBigBlindEnteredEvent = (current: PlayerToTalkContext, event: BigBlindEnteredEvent, context: AllInPlayersResult & PlayersInHandResult) => this.nextPlayer(current.value.seat, current.dealer, context);
    protected handleCheckEvent = (current: PlayerToTalkContext, event: CheckEvent, context: AllInPlayersResult & PlayersInHandResult) => this.nextPlayer(current.value.seat, current.dealer, context);
    protected handleRaiseEvent = (current: PlayerToTalkContext, event: RaiseEvent, context: AllInPlayersResult & PlayersInHandResult) => this.nextPlayer(current.value.seat, current.dealer, context);
    protected handleAllInEvent = (current: PlayerToTalkContext, event: AllInEvent, context: AllInPlayersResult & PlayersInHandResult) => this.nextPlayer(current.value.seat, current.dealer, context);
    protected handleFoldEvent = (current: PlayerToTalkContext, event: FoldEvent, context: AllInPlayersResult & PlayersInHandResult) => this.nextPlayer(current.value.seat, current.dealer, context);

    private nextPlayer(currentPlayerSeat: Seat, dealer: Seat, context: AllInPlayersResult & PlayersInHandResult): PlayerToTalkContext {
        // TODO skip all in players
        const orderedPlayers = _.sortBy(context.playersInHand.value, p => p.seat);
        const currentPlayerIndex = _.findIndex(orderedPlayers, p => p.seat === currentPlayerSeat);
        return { value: orderedPlayers[(currentPlayerIndex + 1) % orderedPlayers.length], dealer };
    }

}

interface PlayersInHand {
    value: {playerId: string, seat: Seat}[]
}

type PlayersInHandResult = { playersInHand: PlayersInHand; }

class PlayersInHandReducer extends BasePartialReducer<PlayersInHand, PlayerToTalkResult> {

    public intial(): PlayersInHand { return { value: [] }; }

    protected handlePlayerJoinedHandEvent(current: PlayersInHand, event: PlayerJoinedHandEvent, context: PlayerToTalkResult): PlayersInHand {
        const {playerId, seat} = event;
        const playersInHand = _.concat(current.value, [{playerId, seat}]);
        return { value: playersInHand };
    }

    protected handleFoldEvent(current: PlayersInHand, event: FoldEvent, context: PlayerToTalkResult) {
        const currentPlayer = context.playerToTalk.value;
        const playersInHand = _.filter(current.value, player => player.playerId === currentPlayer.playerId);
        return { value: playersInHand };
    }
}

interface AllInPlayers {
    value: {playerId: string, seat: Seat}[]
}

type AllInPlayersResult = { allInPlayers: AllInPlayers; }

class AllInPlayersReducer extends BasePartialReducer<AllInPlayers, PlayerToTalkResult> {

    public intial(): AllInPlayers { return { value: [] }; }

    protected handleAllInEvent(current: AllInPlayers, event: AllInEvent, context: PlayerToTalkResult): AllInPlayers {
        const allInPlayers = _.concat(current.value, [context.playerToTalk.value]);
        return { value: allInPlayers };
    }
}

export { PlayerToTalk, PlayerToTalkResult, PlayersInHand, PlayersInHandResult, AllInPlayers, AllInPlayersResult };

export class HandPlayers {
    
    public static reducers(): {
        allInPlayers: PartialReducer<AllInPlayers, PlayerToTalkResult>,
        playerToTalk: PartialReducer<PlayerToTalk, AllInPlayersResult & PlayersInHandResult>,
        playersInHand: PartialReducer<PlayersInHand, PlayerToTalkResult>
    } {
        return {
            allInPlayers: new AllInPlayersReducer(),
            playerToTalk: new PlayerToTalkReducer(),
            playersInHand: new PlayersInHandReducer()
        }
    } 

} 

const a = combineReducers({
    ...HandPlayers.reducers()
})
