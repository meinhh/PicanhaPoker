<template>
    <v-card dark tile :elevation="elevation" class="error-panel" width=100%>
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
                v-if="showImage"
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
    @Prop({ default: '' }) public title!: string;
    @Prop({ default: '' }) public message!: string;
    @Prop() public errorImgSrc!: string;
    @Prop() public retry!: () => void;
    @Prop({ default: false }) public flat!: boolean;
    @Prop({ default: true }) showImage!: boolean;

    public get elevation() {
        if (this.flat) {
            return 0;
        }

        return 10;
    }
}
</script>

<style lang="scss">
.error-panel {
    padding: 20px;
    opacity: $tp-card-opacity;
    background: $tp-card-bg;
}
</style>