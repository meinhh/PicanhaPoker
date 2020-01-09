<template>
    <div>
        <bot-avatar
            v-for="avatar in buildinAvatars" :key="avatar"
            :click="() => avatarSelected(avatar)"
            :size="64"
            class="avatar-option"
            :src="avatar">
        </bot-avatar>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import BotAvatar from '@/components/BotAvatar.vue';

@Component({
    components: {
        BotAvatar
    }
})
export default class AvatarPicker extends Vue {
    @Prop({required: true}) 
    public avatarSelected: (avatarImgUrl: string) => void;

    public buildinAvatars: (string | null)[];

    public created() {
        this.buildinAvatars = [null];

        for (let i = 1; i <= 41; i++) {
            this.buildinAvatars.push("robot_" + i + ".png");
        }
    }
}
</script>

<style lang="scss">
.avatar-option {
    margin: 4px;
}
</style>