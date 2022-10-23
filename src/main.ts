import { createApp, markRaw } from "vue";
import App from "@/App.vue";
import { createPinia } from "pinia";
import { containerKey, createContainer } from "@/container";
import { useConfigStore } from "@/stores/useConfigStore";

const isProduction = import.meta.env.PROD;

async function start() {
  const container = createContainer(isProduction);
  const pinia = createPinia().use(({ store }) => {
    store.container = markRaw(container);
  });
  createApp(App).use(pinia).provide(containerKey, container).mount("#app");
  await useConfigStore().init();

  // @ts-ignore
  window.container = container;
}
start();
