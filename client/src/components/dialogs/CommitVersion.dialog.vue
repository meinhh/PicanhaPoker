<template>
    <v-card dark>
        <v-card-title primary-title class="headline">
            Commit your changes
        </v-card-title>
        <v-card-text>
            <v-text-field v-model="message" label="Describe what you did">
            </v-text-field>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn @click="close" text>Cancel</v-btn>
            <v-btn @click="submit" text color="primary">Commit</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { DialogObject } from 'vuetify-dialog';

@Component({
})
export default class CommitVersionDialog extends Vue {
    public message = '';

    public submit(): void {
        this.$emit('submit', this.message);
    }

    public close() {
        this.$emit('submit');
    }
}
</script>

<style lang="scss">

</style>