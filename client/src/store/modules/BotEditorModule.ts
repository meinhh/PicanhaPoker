import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { inject } from 'inversify-props';
import 'reflect-metadata'
import store from '@/store';
import router from '@/router';
import Bot from '../../../../common/app/Bot'
import IBotsApiAccessor from '@/services/botsApiAccessor/IBotsApiAccessor';
import { AsyncState } from '@/utils/AsyncState';
import BotVersion from '../../../../common/app/BotVersion'

export class BotVersionProps {
    public constructor(public botId: number, public code: string, public message?: string) {
    }
}

@Module
export default class BotEditorModule extends VuexModule {
    private _botToEdit: Bot | null = null;
    private _botLoadingStatus: AsyncState = AsyncState.DONE;
    private _contextLoadingStatus: AsyncState = AsyncState.DONE;
    private _checkedoutVersion: BotVersion | null = null;

    get botToEdit() {
        return this._botToEdit;
    }

    get botLoadingStatus() {
        return this._botLoadingStatus;
    }

    get contextLoadingStatus() {
        return this._contextLoadingStatus;
    }

    get checkedOutVersion() {
        return this._checkedoutVersion;
    }

    @Mutation
    public setBotToEdit(bot: Bot) {
        this._botToEdit = bot;
    }

    @Mutation
    public setBotLoadingStatus(status: AsyncState) {
        this._botLoadingStatus = status;
    }

    @Mutation
    public setContextLoadingStatus(status: AsyncState) {
        this._contextLoadingStatus = status;
    }

    @Mutation
    public pushNewActiveVersion(newVersion: BotVersion) {
        const bot = this._botToEdit;
        if (bot) {
            bot.activeVersionId = newVersion.botVersionId;
            bot.activeVersion = newVersion;

            if (bot.versions) {
                bot.versions.push(newVersion);
            }
        }
    }

    @Mutation
    public setCheckedoutVersion(version: BotVersion) {
        this._checkedoutVersion = version;
    }

    @Mutation
    public deleteBotVersion(versionId: number) {
        console.log(this._botToEdit)
        if (!this._botToEdit || !this._botToEdit.versions) {
            return;
        }

        const versionIdx = this._botToEdit.versions.findIndex((curVer: BotVersion) => curVer.botVersionId == versionId);
        console.log(versionIdx);
        if (versionIdx !== undefined && versionIdx > -1) {
            this._botToEdit.versions.splice(versionIdx, 1);
        }
    }

    @Action
    public async loadBotToEdit(botName: string) {
        this.context.commit('setBotLoadingStatus', AsyncState.LOADING);
        try {
            const bot = await this.context.rootState._botsAccessor.loadBotWithActiveCode(botName);
            this.context.commit('setBotToEdit', bot);
            this.context.commit('setCheckedoutVersion', bot.activeVersion);
            this.context.commit('setBotLoadingStatus', AsyncState.DONE);
        } catch (ex) {
            this.context.commit('setBotLoadingStatus', AsyncState.ERROR);
        }
    }
    
    @Action
    public async createBotVersion(versionsProps: BotVersionProps) {
        this.context.commit('setContextLoadingStatus', AsyncState.LOADING);
        try {
            const newVersion = await this.context.rootState._botsAccessor.createBotVersion(
                versionsProps.botId, versionsProps.code, versionsProps.message);
            this.context.commit('pushNewActiveVersion', newVersion);
            this.context.commit('setCheckedoutVersion', newVersion);
            this.context.commit('setContextLoadingStatus', AsyncState.DONE);
        } catch(ex) {
            this.context.commit('setContextLoadingStatus', AsyncState.ERROR);
        }
    }

    @Action
    public async checkoutVersion(versionId: number) {
        this.context.commit('setContextLoadingStatus', AsyncState.LOADING);
        try {
            const loadedVersion = await this.context.rootState._botsAccessor.loadBotVersion(versionId);
            this.context.commit('setCheckedoutVersion', loadedVersion);
            this.context.commit('setContextLoadingStatus', AsyncState.DONE);
        } catch(ex) {
            this.context.commit('setContextLoadingStatus', AsyncState.ERROR);
        }
    }

    @Action
    public async deleteVersion(versionId: number) {
        this.context.commit('setContextLoadingStatus', AsyncState.LOADING);
        try {
            await this.context.rootState._botsAccessor.deleteBotVersion(versionId);
            
            if (this._checkedoutVersion && this._botToEdit && versionId == this._checkedoutVersion.botVersionId) {
                this.context.commit('setCheckedoutVersion', this._botToEdit.activeVersion);
            }

            this.context.commit('deleteBotVersion', versionId);
            this.context.commit('setContextLoadingStatus', AsyncState.DONE);
        } catch(ex) {
            this.context.commit('setContextLoadingStatus', AsyncState.ERROR);
        }
    }
}