<template>
    <div class="editor-page" :style="{'background-image': 'url(' + require('../assets/bg6.jpg') + ')'}">
        <v-layout column fill-height>
            <page-title text="WRITE YOUR BOT"></page-title>
            <v-flex class="editor-container">
                <v-toolbar dense dark short class="editor-toolbar">
                    <v-avatar size="32">
                        <img src="https://www.globalpokerindex.com/wp-content/uploads/2015/08/doyle_brunson-210x210.jpg">
                    </v-avatar>
                    <div class="path">
                        <span class="level">{{username}}</span>
                        <span class="divier"></span>
                        <span class="level enabled">{{botName.trim()}}.js</span>
                    </div>
                    <v-spacer></v-spacer>
                    <v-tooltip bottom v-for="action in editorActions" :key="action.icon">
                        <template v-slot:activator="{ on }">
                            <v-btn icon v-on="on">
                                <v-icon>{{action.icon}}</v-icon>
                            </v-btn>
                        </template>
                        <span>{{action.tooltip}}</span>
                    </v-tooltip>
                </v-toolbar>
                <div class="editor">
                    <codemirror v-model="code" :options="cmOptions"></codemirror>
                </div>
            </v-flex>
        </v-layout>
    </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import PageTitle from '@/components/PageTitle.vue';

@Component({
    components: {
        PageTitle
    }
})
export default class BotEditor extends Vue {
    public requestedBotName: string;
    public botName: string = 'MyBot';
    public username: string = 'Picanha';
    public code: string = 'function playTurn(tableContext) {\n\t\n}\n';

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

    public editorActions = [{
        tooltip: 'Documentation',
        icon: 'menu_book',
        onClick: null,
    }, {
        tooltip: 'Save changes locally',
        icon: 'save',
        onClick: null,
    }, {
        tooltip: 'Upload changes',
        icon: 'cloud_upload',
        onClick: null,
    }, {
        tooltip: 'Discard changes',
        icon: 'clear',
        onClick: null,
    }, {
        tooltip: 'Upload & Run',
        icon: 'play_circle_outline',
        onClick: null,
    }]

    public mouted() {
        this.requestedBotName = this.$route.params.botName;
    }
}
</script>

<style lang="scss">
.editor-page {
    height: 100%;
    background-size: 100% 100%;

    .editor-container {
        opacity: 0.9;
        position: relative;
        overflow: hidden;
        flex: 9;
        
        .editor-toolbar {
            height: 8%!important;
            background-color: $tp-card-bg!important;
            .path {
                span.level {
                    margin: 0 10px;

                    &.enabled {
                        text-decoration: underline;
                        cursor: pointer;
                    }
                }

                span.divier::before {
                    content: '>';
                }
            }
        }
        .editor {
            height: 92%;
            flex:1 1 auto;
            margin-top:0;
            position:relative;
            .CodeMirror {
                position:absolute;
                top:0;
                bottom:0;
                left:0;
                right:0;
                height:100%;
            }
        }
    }
}
</style>
