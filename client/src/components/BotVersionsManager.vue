<template>
    <div class="versions-manager">
        <v-timeline dense>
            <div 
                v-for="(version, i) in botVersions" 
                :key="i"
                class="version-row"
                @contextmenu="showContextMenu(version, $event)">
                <v-timeline-item 
                    right
                    small
                    fill-dot
                    :color="version.botVersionId == checkedoutVersionId  ? 'purple' : 'primary'"
                    :icon="version.botVersionId == bot.activeVersionId ? 'local_offer' : null">
                    <v-layout>
                        <v-flex lg1>
                            <span class="caption version-id">{{version.botVersionId}}</span>
                        </v-flex>
                        <v-flex>
                            <span class="caption">{{version.message}}</span>
                        </v-flex>
                        <v-flex lg4>
                            <span class="caption version-date">
                                {{new Date(version.dateCreated).toLocaleString()}}
                            </span>
                        </v-flex>
                    </v-layout>
                </v-timeline-item>
            </div>
        </v-timeline>
        <v-menu 
            v-model="shouldShowCtxMenu"
            :position-x="ctxMenuX"
            :position-y="ctxMenuY"
            absolute
            offset-y>
            <v-list dense>
                <v-list-item
                    v-for="(item, index) in contextMenuOptions" 
                    :key="index"
                    @click="invokeOptionCallback(item)">
                    <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import BotVersion from '../../../common/app/BotVersion';
import Bot from '../../../common/app/Bot';

export interface IContextMenuOption {
    text: string;
    onClick: (version: BotVersion) => void;
}

@Component({})
export default class BotVersionsManager extends Vue {
    @Prop({ required: true }) public bot!: Bot;
    @Prop({ required: true }) public checkedoutVersionId!: number;
    @Prop() public contextMenuOptions!: any[];

    public shouldShowCtxMenu: boolean = false;
    public ctxMenuX: number = 0;
    public ctxMenuY: number = 0;
    public inspectedVersion: BotVersion | null = null;

    public get botVersions() {
        if (!this.bot || !this.bot.versions) {
            return;
        }
        
        return this.bot.versions.sort((ver1, ver2) => 
            new Date(ver2.dateCreated).getTime() - new Date(ver1.dateCreated).getTime())
    }
    
    public showContextMenu(version: BotVersion, e: MouseEvent) {
        e.preventDefault();
        this.shouldShowCtxMenu = false;
        this.ctxMenuX = e.clientX;
        this.ctxMenuY = e.clientY;
        this.inspectedVersion = version;

        this.$nextTick(() => {
            this.shouldShowCtxMenu = true;
        })
    }

    public invokeOptionCallback(option: IContextMenuOption) {
        if (!this.inspectedVersion) {
            return;
        }

        option.onClick(this.inspectedVersion);
    }

}
</script>

<style lang="scss">
.versions-manager {
    color: #eee;
    background: #212121;
    
    .version-row {
        &:hover {
            background: #333;
        }

        span.version-id {
            color: grey;
    
            &::before {
                content: '#'
            }
        }
    
        span.version-date {
        }
    }
}
</style>