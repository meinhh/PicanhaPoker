import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import Bot from 'common/app/Bot'

@Module
export default class BotsModule extends VuexModule {
    _myBots: Bot[];

    @Mutation
    setMyBots(myBots: Bot[]) {
        this._myBots = myBots;
    }

    get myBots() {
        return this._myBots;
    }
}