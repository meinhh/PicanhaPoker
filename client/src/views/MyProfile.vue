<template>
    <div class="my-profile-page" :style="{'background-image': 'url(' + require('../assets/bg.jpg') + ')'}">
        <page-title text="ME"></page-title>
        <v-layout align-center justify-center fill-height v-show="myBotsLoadingStatus == 'LOADING'">
                <v-progress-circular
                    :width="15"
                    :size="300"
                    color="red"
                    indeterminate></v-progress-circular>
        </v-layout>
        <v-layout  align-center justify-center fill-height v-show="myBotsLoadingStatus == 'ERROR'">
            <v-flex style="padding:20px" lg8>
                <error-panel 
                    title="Oops" 
                    message="We failed to load your bots. Please try again."
                    :retry="() => loadMyBots()">
                </error-panel>
            </v-flex>
        </v-layout>
        <v-layout class="d-wrap flex-wrap" v-show="myBotsLoadingStatus == 'DONE'">
            <v-flex lg4 style="padding: 20px" v-for="bot in myBots" :key="bot.botId">
                <bot-preview-card :bot="bot">
                </bot-preview-card>
            </v-flex>
            <v-flex lg4 style="padding:20px" :key="6" class="d-flex align-stretch">
                <v-sheet dark tile elevation=10 class="create-bot" width=100%>
                    <div class="activator" v-show="!isCreatingBot" @click="startNewBot()">
                        <v-icon color="orange">code</v-icon>
                        <div class="headline">CREATE A BOT</div>
                    </div>
                    <div class="bot-creation-form" v-show="isCreatingBot">
                        <v-form>
                            <v-container>
                                <v-row>
                                    <v-text-field 
                                        label="Name your bot" 
                                        v-model="constructedBot.botName"
                                        required>
                                    </v-text-field>
                                </v-row>
                                <v-row>
                                    <v-btn text color="success">Save</v-btn> 
                                    <v-spacer></v-spacer>
                                    <v-btn text @click="isCreatingBot = false">Cancel</v-btn>
                                </v-row>
                            </v-container>
                        </v-form>
                    </div>
                </v-sheet>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Action, Getter } from 'vuex-class';
import PageTitle from '@/components/PageTitle.vue';
import BotPreviewCard from '@/components/BotPreviewCard.vue';
import ErrorPanel from '@/components/ErrorPanel.vue';
import Bot from '../../../common/app/Bot';
import { AsyncState } from '../utils/AsyncState';

class ConstructedBotProperties {
    public constructor(public botName: string = '', public avatar: string = '') {}

    public reset() {
        this.botName = '';
        this.avatar = '';
    }
}

@Component({
    components: {
        PageTitle, 
        BotPreviewCard,
        ErrorPanel
    }
})
export default class MyProfile extends Vue {
    @Getter('myBots')
    public myBots!: Bot[];

    @Getter('myBotsLoadingStatus')
    public myBotsLoadingStatus!: AsyncState;

    public isCreatingBot = false;
    public constructedBot = new ConstructedBotProperties();

    public mounted() {
        this.isCreatingBot = false;
        this.constructedBot = new ConstructedBotProperties();

        this.loadMyBots();
    }

    @Action('loadMyBots') 
    public loadMyBots: () => void;

    public startNewBot() {
        this.isCreatingBot = true;
    }

    public discardNewBot() {
        this.isCreatingBot = false;
    }
}
</script>

<style lang="scss">
.my-profile-page {
    height: 100%;
    background-size: 100% 100%; 

    .create-bot {
        padding: 20px;
        font-family: $app-font;
        display: flex;
        text-align: center;
        opacity: $tp-card-opacity;
        background: $tp-card-bg!important;
        align-items: center;
        justify-content: center;

        .activator {
            cursor: pointer;
            .v-icon {
                font-size: 85px;
                transition: font-size 0.5s;
            }

            &:hover {
                .v-icon {
                    font-size: 120px;
                }
            }
        }
    }
}
</style>