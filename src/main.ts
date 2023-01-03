import "reflect-metadata";
import { createApp } from "vue";
import App from "@/App.vue";
import { createPinia } from "pinia";
import { createContainer, provideContainer } from "@/container";
import type { StorageService } from "@/services/StorageService";
import type { ScreenService } from "@/services/ScreenService";
import { ServiceType } from "@/serviceTypes";
import type { AppService } from "@/services/AppService";

const isProduction = import.meta.env.PROD;

async function start() {
  const pinia = createPinia();

  const container = createContainer(isProduction);
  provideContainer(container);

  createApp(App).use(pinia).mount("#app");

  const storageService = container.get<StorageService>(
    ServiceType.StorageService
  );
  await storageService.init({
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
  });

  const appService = container.get<AppService>(ServiceType.AppService);
  await appService.init();

  const screenService = container.get<ScreenService>(ServiceType.ScreenService);
  await screenService.init();
}
start();
