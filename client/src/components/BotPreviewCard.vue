<template>
    <v-card tile dark raised class="bot-preview-card align-stretch">
        <v-list-item>
            <v-list-item-avatar>
                <bot-avatar :size="46" :src="bot.avatarImgUrl">
                </bot-avatar>
            </v-list-item-avatar>
            <v-list-item-title class="display-1 bot-name">{{bot.name}}</v-list-item-title>
        </v-list-item>

        <v-card-text class="title">
            <div class="balance display-1">
                10000$
            </div>
            <div class="body-1">
                LAST MODIFIED: <span class="last-modified">{{new Date(bot.activeVersion.dateCreated).toLocaleString()}}</span>
            </div>

        </v-card-text>

        <v-card-actions>
            <v-menu bottom right dark>
                <template v-slot:activator="{ on }">
                    <v-btn dark icon large color="orange" v-on="on">
                        <v-icon>more_horiz</v-icon>
                    </v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="action in menuActions" :key="action.caption" @click="() => {}">
                        <v-list-item-icon>
                            <v-icon>{{action.icon}}</v-icon>
                        </v-list-item-icon>
                        <v-list-item-title>{{action.caption}}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            
            <v-spacer></v-spacer>
            
            <v-tooltip bottom v-for="action in quickActions" :key="action.icon">
                <template v-slot:activator="{ on }">
                    <v-btn icon color="orange" v-on="on" large>
                        <v-icon>{{action.icon}}</v-icon>
                    </v-btn>
                </template>
                <span>{{action.tooltip}}</span>
            </v-tooltip>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Bot from '../../../common/app/Bot';
import BotAvatar from '@/components/BotAvatar.vue';

@Component({
    components: {
        BotAvatar
    }
})
export default class BotPreviewCard extends Vue {
    @Prop() public bot: Bot;

    public menuActions= [ {
        icon: "edit",
        caption: "Edit details",
        onClick: null
    }, {
        icon: "delete",
        caption: "Delete bot",
        onClick: null
    }]

    public quickActions = [{
        tooltip: "Bot stats",
        icon: "trending_up",
        onClick: null
    }, {
        tooltip: "Code",
        icon: "code",
        onClick: null
    }]
}
</script>

<style lang="scss">
.bot-preview-card {
    opacity: $tp-card-opacity;
    background: $tp-card-bg!important;

    div.balance {
        color: green;
        text-align: center;
        padding-bottom: 8px;
    }

    span.last-modified {
        color: yellow;
    }
}
</style>