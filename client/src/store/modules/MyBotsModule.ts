import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { inject } from 'inversify-props';
import 'reflect-metadata'

import Bot from 'common/app/Bot'
import IBotsApiAccessor from '@/services/botsApiAccessor/IBotsApiAccessor';
import { AsyncState } from '@/utils/AsyncState';

@Module
export default class MyBotsModule extends VuexModule {
    @inject('BotsAccessor') private _botsAccessor: IBotsApiAccessor;

    private _myBots: Bot[] = [];
    private _myBotsLoadingStatus: AsyncState = AsyncState.DONE;
    private _myBotsLoadingError: string = '';

    @Mutation
    setMyBots(myBots: Bot[]) {
        this._myBots = myBots;
    }

    @Mutation
    setMyBotsLoadingStatus(status: AsyncState) {
        this._myBotsLoadingStatus = status;
    }

    get myBots() {
        return this._myBots;
    }

    get myBotsLoadingStatus() {
        return this._myBotsLoadingStatus;
    }

    @Action
    async loadMyBots() {
        this.context.commit('setMyBotsLoadingState', AsyncState.LOADING);

        try {
            const myBots = await this._botsAccessor.getMyBots();
            this.context.commit('setMyBots', myBots);
            this.context.commit('setMyBotsLoadingState', AsyncState.DONE);
        } catch (ex) {
            this.context.commit('setMyBotsLoadingState', AsyncState.ERROR);
        }

    }
}