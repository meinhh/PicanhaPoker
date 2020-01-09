<template>
    <div class="page-title">
        <div class="display-1">
            {{text}}
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
})
export default class PageTitle extends Vue {
    @Prop({required: true}) public text!: string;
}
</script>

<style lang="scss">
.page-title {
    opacity: 0.55;
    background: #000;
    color: #eee;
    flex: 1;

    .display-1 {
        text-align: center;
        padding: 12px;
    }
}
</style>