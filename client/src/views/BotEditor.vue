<template>
    <div class="editor-page" :style="{'background-image': 'url(' + require('../assets/bg6.jpg') + ')'}">
        <div class="header">
            <div class="title">
                WRITE YOUR BOT
            </div>
        </div>
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

  public code: string = 'function playTurn(tableContext) {\n\t\n}';

  public cmOptions = {
        tabSize: 2,
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
    
    .header {
        opacity: 0.55;
        background: #000;
        color: #eee;

        .title {
            padding: 12px;
            font-size: 36px;
            font-family: 'CONSOLAS'
        }
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
