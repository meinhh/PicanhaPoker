import Vue from 'vue';
import Vuex from 'vuex';
import {container, cid} from 'inversify-props';

import myBotsModule from '@/store/modules/MyBotsModule';
import botEditorModule from '@/store/modules/BotEditorModule';
import IBotsApiAccessor from '@/services/botsApiAccessor/IBotsApiAccessor';

export interface RootState {
    _botsAccessor: IBotsApiAccessor
}

export default function initializeStore() {
    Vue.use(Vuex);
    return new Vuex.Store<RootState>({
        state: {
            _botsAccessor: container.get('BotsAccessor')
        },
        modules: {
          myBotsModule,
          botEditorModule
        },
    })
}
// export default new Vuex.Store({
//   state: {
//   },
//   mutations: {
//   },
//   actions: {
//   },
//   modules: {
//     myBotsModule,
//     botEditorModule
//   },
// });
