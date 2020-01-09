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
                                    <v-layout fill-height align-center justify-center>
                                        <v-flex style="padding:8px">
                                            <bot-avatar 
                                                :click="openAvatarPicker" 
                                                :src="constructedBot.avatar"></bot-avatar>
                                        </v-flex>
                                        <v-flex>
                                            <v-text-field 
                                                label="Name your bot" 
                                                v-model="constructedBot.botName"
                                                required>
                                            </v-text-field>
                                        </v-flex>
                                    </v-layout>
                                </v-row>
                                <v-row>
                                    <v-btn 
                                        text 
                                        color="success" 
                                        :loading="creatingBotStatus == 'LOADING'"
                                        @click="createNewBotInvoker">Save</v-btn> 
                                    <v-spacer></v-spacer>
                                    <v-btn text @click="isCreatingBot = false">Cancel</v-btn>
                                </v-row>
                                <v-row v-if="creatingBotStatus == 'ERROR'">
                                    <div class="caption red--text">
                                        We're sorry, something went wrong. Please try again.
                                    </div>
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
import BotAvatar from '@/components/BotAvatar.vue';
import AvatarPickerDialog from '@/components/dialogs/AvatarPicker.dialog.vue';
import Bot from '../../../common/app/Bot';
import { AsyncState } from '../utils/AsyncState';
import { ConstructedBotProperties } from '../store/modules/MyBotsModule';

@Component({
    components: {
        PageTitle, 
        BotPreviewCard,
        ErrorPanel,
        AvatarPickerDialog,
        BotAvatar
    }
})
export default class MyProfile extends Vue {
    @Getter('myBots')
    public myBots!: Bot[];

    @Getter('myBotsLoadingStatus')
    public myBotsLoadingStatus!: AsyncState;

    @Getter('creatingBotStatus')
    public creatingBotStatus!: AsyncState;

    public isCreatingBot = false;
    public constructedBot = new ConstructedBotProperties();

    public mounted() {
        this.isCreatingBot = false;
        this.constructedBot = new ConstructedBotProperties();

        this.loadMyBots();
    }

    @Action('loadMyBots') 
    public loadMyBots!: () => void;

    @Action('createNewBot')
    public createNewBot!: (botPros: ConstructedBotProperties) => void;

    public startNewBot() {
        this.isCreatingBot = true;
    }

    public discardNewBot() {
        this.isCreatingBot = false;
    }

    public async openAvatarPicker() {
        const dialog = await this.$dialog.show(AvatarPickerDialog);
        const avatar = await dialog.wait();
        this.constructedBot.avatar = avatar ? avatar : '';
    }

    public async createNewBotInvoker() {
        await this.createNewBot(this.constructedBot);

        if (this.creatingBotStatus == AsyncState.DONE) {
            this.isCreatingBot = false;
            this.constructedBot.reset();
        }
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