<template>
    <div class="editor-page">
        <h1>hello world</h1>
        <codemirror v-model="code" :options="cmOptions"></codemirror>
    </div>
</template>

<script lang="ts">
import PrismEditor from 'vue-prism-editor';
import { codemirror } from 'vue-codemirror';
import { Component, Prop, Vue } from 'vue-property-decorator';
import 'codemirror/lib/codemirror.css';

@Component({
  components: { codemirror },
})
export default class BotEditor extends Vue {
  @Prop() private msg!: string;

  public code: string;

  public cmOptions = {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'base16-dark',
        lineNumbers: true,
        line: true,
    }
}
</script>

<style lang="scss">
.editor-page {
    height: 100%;
    background: green;

    h1 {
        margin-top:0;
    }
}
</style>
