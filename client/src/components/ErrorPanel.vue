<template>
    <v-card dark tile elevation=10 class="error-panel" width=100%>
        <div class="d-flex flex-no-wrap justify-space-between">
            <div>
                <v-card-title class="display-2">
                    {{title}}
                </v-card-title>
                <v-card-subtitle class="headline" v-text="message"></v-card-subtitle>
                <v-card-actions v-if="retry">
                    <v-btn text @click="retry()">Retry</v-btn>
                </v-card-actions>
            </div>
            <v-avatar
                class="ma-3"
                size="125"
                tile>
                <v-img src="@/assets/icons/robot_error.png"></v-img>
            </v-avatar>
        </div>  
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
})
export default class BotPreviewCard extends Vue {
    @Prop() public title!: string;
    @Prop() public message!: string;
    @Prop() public errorImgSrc!: string;
    @Prop() public retry!: () => void;
}
</script>

<style lang="scss">
.error-panel {
    padding: 20px;
    opacity: $tp-card-opacity;
    background: $tp-card-bg;
}
</style>