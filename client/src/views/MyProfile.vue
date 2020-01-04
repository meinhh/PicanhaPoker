<template>
    <div class="my-profile-page" :style="{'background-image': 'url(' + require('../assets/bg.jpg') + ')'}">
        <page-title text="ME"></page-title>
        <v-layout class="d-wrap flex-wrap">
            <v-flex lg3 style="padding: 20px" v-for="n in 3" :key="n">
                <bot-preview-card :bot="bot">
                </bot-preview-card>
            </v-flex>
            <v-flex lg3 style="padding:20px" :key="6" class="d-flex align-stretch">
                <v-sheet dark tile elevation=10 class="create-bot" width=100%>
                    <div class="link">
                        <v-icon color="orange">code</v-icon>
                        <div class="headline">CREATE A BOT</div>
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
import Bot from '../../../common/app/Bot';

@Component({
    components: {
        PageTitle, 
        BotPreviewCard
    }
})
export default class MyProfile extends Vue {
    @Action('loadMyBots') private loadMyBots: () => void;
    
    public bot: Bot = {
        botId: 1,
        name: "Brundson",
        dateCreated: new Date(),
        ownerUserId: 1,
    }

    public mounted() {
        this.loadMyBots();
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

        .link {
            cursor: pointer;
            .v-icon {
                font-size: 85px;
                transition: font-size 0.5s;
            }

            &:hover {
                .v-icon {
                    font-size: 100px;
                }
            }
        }
    }
}
</style>