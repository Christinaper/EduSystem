import { createPinia } from "pinia";
import piniaPersist from 'pinia-plugin-persist'
import { useDashboardStore } from "./modules/dashboard";
import { useDictionaryStore } from "./modules/dictionary";
import type { App } from "vue";

const pinia = createPinia();
pinia.use(piniaPersist)

interface IAppStore {
  dashboard: ReturnType<typeof useDashboardStore>;
  dictionary: ReturnType<typeof useDictionaryStore>;
}

const store: IAppStore = {} as IAppStore;

// main.ts来use
export const StoreInstaller = {
  install: function(app: App) {
    app.use(pinia);
    store.dashboard = useDashboardStore();
    store.dictionary = useDictionaryStore();
  }
}

// 所有仓库已经use好了，并收拢在store中,这里导出给外面用
export default store;