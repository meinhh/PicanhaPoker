<template>
    <div class="editor-page" :style="{'background-image': 'url(' + require('../assets/bg6.jpg') + ')'}">
        <h1>hello world</h1>
        <div class="editor-container">
            <codemirror v-model="code" :options="cmOptions"></codemirror>
        </div>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
})
export default class BotEditor extends Vue {
  @Prop() private msg!: string;

  public code: string = 'const a = 10';

  public cmOptions = {
        tabSize: 4,
        mode: 'text/javascript',
        theme: 'monokai',
        lineNumbers: true,
        line: true,
        height: 100,
        styleActiveLine: true,
        matchBrackets: true,
        showCursorWhenSelecting: true,
    }
}
</script>

<style lang="scss">
.editor-page {
    height: 100%;
    // background: rgb(40,103,56);
    // background-image: url('../assets/bg2.jpg')
    background-size: 100% 100%;

    h1 {
        margin-top:0;
    }

    .CodeMirror {
        height: 100%;
    }

    .editor-container {
        opacity: 0.9;
        height: 80%;
        position: relative;

        .vue-codemirror {
            height: 100%;
            text-align: left;
        }
    }
}
</style>
