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
    
    get myBots() {
        return this._myBots;
    }

    get myBotsLoadingStatus() {
        return this._myBotsLoadingStatus;
    }

    @Mutation
    setMyBots(myBots: Bot[]) {
        this._myBots = myBots;
    }

    @Mutation
    setMyBotsLoadingStatus(status: AsyncState) {
        this._myBotsLoadingStatus = status;
    }

    @Action
    async loadMyBots() {
        this.context.commit('setMyBotsLoadingStatus', AsyncState.LOADING);

        try {
            const myBots = await this._botsAccessor.getMyBots();
            this.context.commit('setMyBots', myBots);
            this.context.commit('setMyBotsLoadingStatus', AsyncState.DONE);
        } catch (ex) {
            this.context.commit('setMyBotsLoadingStatus', AsyncState.ERROR);
        }

    }
}