<template>
    <v-avatar
        class="bot-avatar"
        @click="clicked()"
        :size="size"
        :class="{enabled: clickable}"
        color="grey">
        <img 
            :src="require(`@/assets/avatars/${src}`)" 
            v-if="src">
    </v-avatar>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';

@Component({})
export default class BotAvatar extends Vue {
    @Prop() public src!: string;
    @Prop({ default: 42 }) public size!: number;
    @Prop({ default: true }) public disabled!: boolean;
    @Prop() public click!: () => void;

    public get clickable() {
        if (this.click || !this.disabled) {
            return true;
        }

        return false;
    }

    public clicked() {
        if (this.clickable && typeof this.click === 'function') {
            this.click();
        }
    }
}
</script>

<style lang="scss">
.bot-avatar {
    &.enabled {
        cursor: pointer;
    }
}
</style>