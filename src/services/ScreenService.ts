import type { StorageService } from "@/services/StorageService";
import type { ScreenStoreDefinition } from "@/stores/ScreenStore";
import type { TileScreen, Tile } from "@/types";
import { EmittedEvent } from "@/types";
import { getRandomString } from "@/utils/getRandomString";
import type { EventEmitterService } from "@/services/EventEmitterService";
import { inject, injectable } from "inversify";
import { ServiceType } from "@/serviceTypes";

@injectable()
export class ScreenService {
  constructor(
    @inject(ServiceType.ScreenStoreDefinition)
    protected screenStoreDefinition: typeof ScreenStoreDefinition,
    @inject(ServiceType.StorageService)
    protected storageService: StorageService,
    @inject(ServiceType.EventEmitterService)
    protected eventEmitterService: EventEmitterService
  ) {}

  public async init() {
    await this.initCurrentScreenId();
    this.eventEmitterService.on(EmittedEvent.CONFIG_LOADED, () => {
      this.initCurrentScreenId();
    });
  }

  protected async initCurrentScreenId() {
    if (this.getCurrentScreenId()) {
      return;
    }
    if (!this.storageService.getIsLoaded()) {
      return;
    }
    const savedScreenId = await this.storageService.getSavedCurrentScreenId();
    let screenId = this.getScreenIds()[0];
    if (savedScreenId && this.getScreenIds().includes(savedScreenId)) {
      screenId = savedScreenId;
    }
    await this.setCurrentScreenId(screenId);
  }

  public getCurrentScreenId() {
    return this.screenStoreDefinition().currentScreenId;
  }

  public async setCurrentScreenId(id: string) {
    this.screenStoreDefinition().currentScreenId = id;
    await this.storageService.saveCurrentScreenId(id);
  }

  public getScreenIds() {
    return this.storageService.getConfig().screenIds;
  }

  public getScreens() {
    return this.storageService.getConfig().screens;
  }

  public canDeleteScreens() {
    return this.getScreenIds().length > 1;
  }

  public async addScreen(payload: Pick<TileScreen, "label">) {
    await this.storageService.addScreen({
      ...payload,
      id: getRandomString(10),
    });
  }

  public async updateScreen(payload: Pick<Tile, "id" | "label">) {
    await this.storageService.updateScreen(payload);
  }

  public async deleteScreen(screenId: string, moveTilesToScreenId?: string) {
    if (!this.canDeleteScreens()) {
      throw new Error("Cannot delete the last screen");
    }
    await this.storageService.deleteScreen(screenId, moveTilesToScreenId);
    if (this.getCurrentScreenId() === screenId) {
      this.setCurrentScreenId(this.getScreenIds()[0]);
    }
  }

  public async reorderScreens(screenIds: string[]) {
    await this.storageService.reorderScreens(screenIds);
  }
}
