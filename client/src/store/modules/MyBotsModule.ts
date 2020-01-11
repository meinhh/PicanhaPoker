import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { inject } from 'inversify-props';
import 'reflect-metadata'
import router from '@/router';
import Bot from 'common/app/Bot'
import IBotsApiAccessor from '@/services/botsApiAccessor/IBotsApiAccessor';
import { AsyncState } from '@/utils/AsyncState';

export class ConstructedBotProperties {
    public constructor(public botName: string = '', public avatar: string = '') {}

    public reset() {
        this.botName = '';
        this.avatar = '';
    }
}

@Module
export default class MyBotsModule extends VuexModule {
    // @inject('BotsAccessor') private _botsAccessor: IBotsApiAccessor;

    private _myBots: Bot[] = [];
    private _myBotsLoadingStatus = AsyncState.DONE;
    private _creatingBotStatus = AsyncState.DONE;
    
    get myBots() {
        return this._myBots;
    }

    get myBotsLoadingStatus() {
        return this._myBotsLoadingStatus;
    }

    get creatingBotStatus() {
        return this._creatingBotStatus;
    }

    @Mutation
    setMyBots(myBots: Bot[]) {
        this._myBots = myBots;
    }

    @Mutation
    setMyBotsLoadingStatus(status: AsyncState) {
        this._myBotsLoadingStatus = status;
    }

    @Mutation
    setCreatingBotStatus(status: AsyncState) {
        this._creatingBotStatus = status;
    }

    @Action
    async loadMyBots() {
        this.context.commit('setMyBotsLoadingStatus', AsyncState.LOADING);

        try {
            const myBots = await this.context.rootState._botsAccessor.getMyBots();
            this.context.commit('setMyBots', myBots);
            this.context.commit('setMyBotsLoadingStatus', AsyncState.DONE);
        } catch (ex) {
            this.context.commit('setMyBotsLoadingStatus', AsyncState.ERROR);
        }
    }

    @Action
    async createNewBot(botProps: ConstructedBotProperties) {
        console.log(botProps);
        this.context.commit('setCreatingBotStatus', AsyncState.LOADING);
        try {
            const newBot = await this.context.rootState._botsAccessor.createBot(botProps.botName, botProps.avatar);
            this.context.commit('setCreatingBotStatus', AsyncState.DONE);
            this.myBots.push(newBot);

            const botName = newBot.name;
            router.push({ 
                name: 'editor', 
                params: { botName }
            })
        } catch (ex) {
            this.context.commit('setCreatingBotStatus', AsyncState.ERROR);
        }
    }
}