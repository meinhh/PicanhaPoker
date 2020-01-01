import { PlayerActionType } from 'common/game/gameEvents/PlayerMoveEvent';

export default class PlayerMoveData {
    public constructor(public actionType: PlayerActionType, public amount: number) {

    }
}