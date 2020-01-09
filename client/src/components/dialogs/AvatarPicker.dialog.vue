<template>
    <v-card dark>
        <v-card-title primary-title class="headline">
            Choose an avatar
        </v-card-title>
        <v-card-text>
            <avatar-picker :avatar-selected="avatarSelected"></avatar-picker>
        </v-card-text>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DialogObject } from 'vuetify-dialog';
import AvatarPicker from '@/components/AvatarPicker.vue';

@Component({
    components: {
        AvatarPicker
    }
})
export default class AvatarPickerDialog extends Vue {
    public avatarSelected(imgUrl: string): void {
        this.$emit('submit', imgUrl);
    }

    public close() {
        this.$emit('submit');
    }
}
</script>

<style lang="scss">

</style>