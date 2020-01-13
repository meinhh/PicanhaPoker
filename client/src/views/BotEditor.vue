<template>
    <div class="editor-page" :style="{'background-image': 'url(' + require('../assets/bg6.jpg') + ')'}">
        <v-layout column fill-height>
            <page-title text="WRITE YOUR BOT"></page-title>
            <v-flex class="editor-container">
                <v-toolbar dense dark short class="editor-toolbar">
                    <bot-avatar :src="bot == null ? '' : bot.avatarImgUrl" :size="32"></bot-avatar>
                    <div class="path">
                        <span class="level">{{username}}</span>
                        <span class="divier"></span>
                        <span class="level enabled">{{botName.trim()}}.js</span>
                        <span class="text--grey caption" v-if="isDone">#{{workingVersion.botVersionId}}</span>
                    </div>
                    <v-progress-linear 
                        :active="contextLoadingStatus == 'LOADING'" 
                        indeterminate absolute bottom color="primary">
                    </v-progress-linear>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom v-for="action in editorActions" :key="action.icon">
                        <template v-slot:activator="{ on }">
                            <v-btn 
                                icon 
                                v-on="on" 
                                v-shortkey="action.shortcut"
                                @shortkey="action.onClick"
                                @click="action.onClick" 
                                v-show="isDone">
                                <v-icon>{{action.icon}}</v-icon>
                            </v-btn>
                        </template>
                        <span>{{action.tooltip}}</span>
                    </v-tooltip>
                </v-toolbar>
                <v-layout 
                    v-show="botLoadingStatus == 'LOADING'" 
                    align-center justify-center fill-height>
                    <v-progress-circular
                        :width="15"
                        :size="300"
                        color="red"
                        indeterminate></v-progress-circular>
                </v-layout>
                <v-layout v-show="botLoadingStatus == 'ERROR'" 
                    fill-height align-center justify-center>
                    <v-flex lg6>
                        <error-panel
                            flat
                            :show-image="false" 
                            title="Oops" 
                            message="Something went wrong, please try again." 
                            :retry="() => loadBotToEdit(botName)">
                        </error-panel>
                    </v-flex>
                </v-layout>
                <v-layout fill-height v-if="isDone">
                    <v-flex 
                        class="versions-manager-wrapper"
                        :class="{'hidden': !shouldShowVersionMgr}">
                        <div class="static">
                            <div v-if="!shouldShowVersionMgr">
                                <v-tooltip right>
                                    <template v-slot:activator="{on}">
                                        <v-btn 
                                            text icon 
                                            v-shortkey="['ctrl', 'alt', 'v']"
                                            @shortkey="toggleVersionsManager"
                                            @click="toggleVersionsManager" 
                                            v-on="on">
                                            <v-icon>timeline</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>Manage versions (Ctrl + Alt  + V)</span>
                                </v-tooltip>
                            </div>
                            <div v-if="shouldShowVersionMgr" class="static-expanded">
                                <div class="subtitle-1 static-title">Versions</div>
                                <v-btn text icon 
                                    @click="toggleVersionsManager" 
                                    v-shortkey="['ctrl', 'alt', 'v']"
                                    @shortkey="toggleVersionsManager">
                                    <v-icon>clear</v-icon>
                                </v-btn>
                            </div>
                        </div>
                        <bot-versions-manager 
                            v-show="shouldShowVersionMgr"
                            :bot="bot" 
                            :checkedout-version-id="workingVersion.botVersionId"
                            :context-menu-options="versionsManagerCtxMenu">    
                        </bot-versions-manager>
                    </v-flex>
                    <v-flex >
                        <div class="editor">
                            <codemirror v-model="code" :options="cmOptions"></codemirror>
                        </div>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import PageTitle from '@/components/PageTitle.vue';
import BotAvatar from '@/components/BotAvatar.vue';
import ErrorPanel from '@/components/ErrorPanel.vue';
import CommitVersionDialog from '@/components/dialogs/CommitVersion.dialog.vue';
import BotVersionsManager from '@/components/BotVersionsManager.vue';
import { Action, Getter } from 'vuex-class';
import Bot from '../../../common/app/Bot';
import { AsyncState } from '../utils/AsyncState';
import {BotVersionProps} from '../store/modules/BotEditorModule';
import BotVersion from '../../../common/app/BotVersion';
import { IContextMenuOption } from '../components/BotVersionsManager.vue';

@Component({
    components: {
        PageTitle,
        BotAvatar,
        ErrorPanel,
        CommitVersionDialog,
        BotVersionsManager
    }
})
export default class BotEditor extends Vue {
    @Getter('botToEdit') public bot!: Bot;
    @Getter('checkedOutVersion') public workingVersion!: BotVersion;
    @Getter('botLoadingStatus') public botLoadingStatus!: AsyncState;
    @Getter('contextLoadingStatus') public contextLoadingStatus!: AsyncState;

    public code: string = '';
    public username: string = 'Picanha';
    public botName: string = '';

    public cmOptions: any = {};
    public editorActions: any[] = [];
    public shouldShowVersionMgr: boolean = false;
    public versionsManagerCtxMenu: IContextMenuOption[] = [];

    @Action('loadBotToEdit')
    public loadBotToEdit!: (botName: string) => void;

    @Action('createBotVersion')
    public createBotVersion!: (versionProps: BotVersionProps) => void;

    @Action('checkoutVersion')
    public checkoutVersion!: (versionId: number) => void;

    @Action('deleteVersion')
    public deleteVersion!: (versionId: number) => void;

    @Action('activateVersion')
    public activateVersion!: (versionId: number) => void;

    public get isDone() {
        return this.bot != null && this.botLoadingStatus == AsyncState.DONE;
    }

    public toggleVersionsManager() {
        this.shouldShowVersionMgr = !this.shouldShowVersionMgr;
    }

    public created() {
        this.code = '';
        this.botName = this.$route.params.botName;
        this.buildEditorActions();
        this.buildCodemirrorOptions();
        this.buildVersionsManagerContextMenu();
    }

    public mounted() {
        this.loadBotToEdit(this.botName);
    }

    @Watch('workingVersion')
    private onCheckedOutVersionChanged(val: BotVersion) {
        if (val) {
            console.log(val);
            this.code = val.code ? val.code : '';
        }
    }

    private async commitChanges() {
        const dialog = await this.$dialog.show(CommitVersionDialog);
        const result = await dialog.wait();

        if (result === undefined) {
            console.log("Commit canceled");
            return;
        }

        const props = new BotVersionProps(this.bot.botId, this.code, result);
        this.createBotVersion(props);
    }

    private async deleteVersionInvoker(version: BotVersion) {
        if (version.botVersionId == this.bot.activeVersionId) {
            this.$dialog.error({
                title: "Nope...",
                text: "You can't delete the active version of your bot. First you have to change it."
            });
            return;
        }

        const result = await this.$dialog.confirm({
            title: "Are you sure?",
            text: "You are about to delete a version, and if you would, you can't go back. Are you sure?",
            waitForResult: true
        })

        console.log(result);
        if (result) {
            console.log('delete version', version);
            this.deleteVersion(version.botVersionId);
        }
    }

    private async activateVersionInvoker(version: BotVersion) {
        const confirmation = await this.$dialog.confirm({
            title: "Are you sure?",
            text: "You are going to activate a different version of your bot. This code will be the one playing the game.",
            waitForResult: true
        });

        if (confirmation) {
            this.activateVersion(version.botVersionId);
        }
    }

    private buildVersionsManagerContextMenu() {
        this.versionsManagerCtxMenu = [{
            text: "Checkout",
            onClick: (version) => {
                console.log("checkout", version);
                this.checkoutVersion(version.botVersionId);
            }
        }, {
            text: "Activate",
            onClick: (version: BotVersion) => {
                console.log("activate version", version);
                this.activateVersionInvoker(version)
            }
        }, {
            text: "Delete",
            onClick: this.deleteVersionInvoker
        }]
    }

    private buildEditorActions() {
        this.editorActions = [{
            tooltip: 'Documentation',
            icon: 'menu_book',
            shortcut: [],
            onClick: () => {},
        }, {
            tooltip: 'Commit changes (Ctrl + Alt + K)',
            icon: 'cloud_upload',
            shortcut: ["ctrl", "alt", "k"],
            onClick: this.commitChanges,
        }, {
            shortcut: [],
            tooltip: 'Upload & Run',
            icon: 'play_circle_outline',
            onClick: () => {},
        }];
    }

    private buildCodemirrorOptions() {
        this.cmOptions = {
            tabSize: 2,
            mode: 'text/javascript',
            theme: 'monokai',
            lineNumbers: true,
            line: true,
            height: 100,
            styleActiveLine: true,
            matchBrackets: true,
            showCursorWhenSelecting: true,
        };
    }
}
</script>

<style lang="scss">
.editor-page {
    height: 100%;
    background-size: 100% 100%;

    .editor-container {
        opacity: 0.9;
        position: relative;
        overflow: hidden;
        flex: 9;
        background: $tp-card-bg;

        .editor-toolbar {
            box-shadow: none;
            height: 9.5%!important;
            background-color: $tp-card-bg!important;
            .path {
                span.level {
                    margin: 0 10px;

                    &.enabled {
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }

                span.divier::before {
                    content: '>';
                }
            }
        }

        .versions-manager-wrapper {
            height: 90.5%;
            position: relative;
            flex: 1;

            &.hidden {
                flex: 0;

                .static {
                    height: 100%;
                    padding: 12px;
                }
            }

            .static {
                background: #222;

                .static-expanded {
                    display: flex;
                    justify-content: space-between;
                }

                .static-title {
                    padding: 0 12px;
                }
            }

            .versions-manager {
                @extend .scrollable; 
                overflow-y: scroll;
                height: 100%;
                width: 100%;
                position: absolute;
            }
        }

        .editor {
            height: 90.5%;
            flex: 1 1 auto;
            margin-top: 0;
            position: relative;

            .CodeMirror {
                position:absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
                height:100%;

                .CodeMirror-vscrollbar {                    
                    @extend .scrollable;
                }
            }
        }
    }
}
</style>
