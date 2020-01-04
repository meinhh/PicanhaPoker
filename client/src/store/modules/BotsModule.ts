import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { inject } from 'inversify-props';
import 'reflect-metadata'

import Bot from 'common/app/Bot'
import IBotsApiAccessor from '@/services/botsApiAccessor/IBotsApiAccessor';

@Module
export default class BotsModule extends VuexModule {
    @inject('BotsAccessor') private _botsAccessor: IBotsApiAccessor;

    private _myBots: Bot[];

    @Mutation
    setMyBots(myBots: Bot[]) {
        this._myBots = myBots;
    }

    get myBots() {
        return this._myBots;
    }

    @Action({ commit: "setMyBots" })
    async loadMyBots() {
        const myBots = await this._botsAccessor.getMyBots();
        console.log(myBots);
        return myBots;
    }
}