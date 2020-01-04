import { PlayerActionType } from 'common';

export default class PlayerMoveData {
    public constructor(public actionType: PlayerActionType, public amount: number = 0) {

    }
}