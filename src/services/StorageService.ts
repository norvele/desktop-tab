import type {
  Coordinates,
  GridParams,
  TileScreen,
  StorageClientServiceInterface,
  Tile,
  TilePlace,
  TilePlaces,
} from "@/types";
import { EmittedEvent } from "@/types";
import type { StorageMigrationService } from "@/services/storageVersion/StorageMigrationService";
import type { StorageConfigData } from "@/services/storageVersion/types";
import type { ConfigStoreDefinition } from "@/stores/configStore";
import type { GridHelperService } from "@/services/GridHelperService";
import type { EventEmitterService } from "@/services/EventEmitterService";
import { inject, injectable } from "inversify";
import { ServiceType } from "@/serviceTypes";
import { cloneDeep } from "lodash";
import type { AppStyle } from "@/types/configRelated/v3/styleTypes";

export const DEFAULT_SCREEN_ID = "default";

interface InitParams {
  windowWidth: number;
  windowHeight: number;
}

@injectable()
export class StorageService {
  protected configDataKey = "config";
  protected configMigrationBackupDataKey = "configMigrationBackup";
  protected localDataCurrentScreenIdKey = "currentScreenId";

  constructor(
    @inject(ServiceType.ConfigStoreDefinition)
    protected configStoreDefinition: typeof ConfigStoreDefinition,
    @inject(ServiceType.StorageClient)
    protected client: StorageClientServiceInterface,
    @inject(ServiceType.LocalStorageClient)
    protected localClient: StorageClientServiceInterface,
    @inject(ServiceType.StorageMigrationService)
    protected storageMigrationService: StorageMigrationService,
    @inject(ServiceType.GridHelperService)
    protected gridHelperService: GridHelperService,
    @inject(ServiceType.EventEmitterService)
    protected eventEmitterService: EventEmitterService
  ) {}

  public async init(params: InitParams) {
    await this.loadConfig(params);
  }

  protected get configStore() {
    return this.configStoreDefinition();
  }

  public getIsLoaded(): boolean {
    return this.configStore.isLoaded;
  }

  public getConfig(): StorageConfigData {
    return this.configStore.config;
  }

  public async updateStyle(style: Partial<AppStyle>) {
    const store = this.configStore;
    store.config.style = {
      ...store.config.style,
      ...style,
    };
    await this.saveConfig();
  }

  public updateStyleWithoutSaving(style: Partial<AppStyle>) {
    const store = this.configStore;
    store.config.style = {
      ...store.config.style,
      ...style,
    };
  }

  public async updateGrid(grid: Partial<GridParams>) {
    const store = this.configStore;
    const gridParams = {
      ...store.config.grid,
      ...grid,
    };
    const isPossible = this.gridHelperService.isPossibleToChangeGridParams(
      gridParams,
      store.config.tilePlaces
    );
    if (!isPossible) {
      throw new Error("Tiles are not fit to the new grid");
    }
    store.config.tilePlaces = this.gridHelperService.normalizePlaces(
      gridParams,
      store.config.tilePlaces
    );
    store.config.grid = gridParams;
    await this.saveConfig();
  }

  public async updateScreen(
    screen: Pick<TileScreen, "id"> & Partial<TileScreen>
  ) {
    const store = this.configStore;
    store.config.screens[screen.id] = {
      ...store.config.screens[screen.id],
      ...screen,
    };
    await this.saveConfig();
  }

  public async addScreen(screen: TileScreen) {
    const store = this.configStore;
    store.config.screenIds.push(screen.id);
    store.config.screens[screen.id] = screen;
    await this.saveConfig();
  }

  public async deleteScreen(screenId: string, moveTilesToScreenId?: string) {
    const store = this.configStore;

    if (moveTilesToScreenId) {
      const tilePlacesToMove = this.gridHelperService.getTilePlacesByScreenId(
        store.config.tilePlaces,
        screenId
      );
      const tileIdsToMove = Object.keys(tilePlacesToMove);
      const movedPlaces = this.gridHelperService.getMovedTilePlacesToScreen(
        store.config.grid,
        store.config.tilePlaces,
        tileIdsToMove,
        moveTilesToScreenId
      );
      store.config.tilePlaces = {
        ...store.config.tilePlaces,
        ...movedPlaces,
      };
    } else {
      const tilePlacesToDelete = this.gridHelperService.getTilePlacesByScreenId(
        store.config.tilePlaces,
        screenId
      );
      Object.keys(tilePlacesToDelete).forEach((tileId) => {
        delete store.config.tiles[tileId];
        delete store.config.tilePlaces[tileId];
      });
    }

    store.config.screenIds = store.config.screenIds.filter(
      (id) => id !== screenId
    );
    delete store.config.screens[screenId];
    await this.saveConfig();
  }

  public async reorderScreens(screenIds: string[]) {
    const store = this.configStore;
    store.config.screenIds = screenIds;
    await this.saveConfig();
  }

  public async updateTile(tile: Pick<Tile, "id"> & Partial<Tile>) {
    const store = this.configStore;
    store.config.tiles[tile.id] = {
      ...store.config.tiles[tile.id],
      ...tile,
    };
    await this.saveConfig();
  }

  public async moveTilesSafely(movedNewTilePlaces: TilePlaces) {
    const movedTileIds = Object.keys(movedNewTilePlaces);
    const isAvailable = Object.values(movedNewTilePlaces).every((place) =>
      this.isPlaceAvailable(place, movedTileIds)
    );
    if (!isAvailable) {
      throw new Error("Not all places are available");
    }
    await this.updateTilePlaces(movedNewTilePlaces);
  }

  public async moveTilesToScreen(tileIds: string[], screenId: string) {
    const store = this.configStore;
    const movedPlaces = this.gridHelperService.getMovedTilePlacesToScreen(
      store.config.grid,
      store.config.tilePlaces,
      tileIds,
      screenId
    );
    store.config.tilePlaces = {
      ...store.config.tilePlaces,
      ...movedPlaces,
    };
    await this.saveConfig();
  }

  public async addTile(tile: Tile, place: TilePlace) {
    const store = this.configStore;
    store.config.tiles[tile.id] = tile;
    store.config.tilePlaces[tile.id] = place;
    await this.saveConfig();
  }

  public async deleteTiles(tileIds: string[]) {
    const store = this.configStore;
    tileIds.forEach((id) => {
      delete store.config.tiles[id];
      delete store.config.tilePlaces[id];
    });
    await this.saveConfig();
  }

  public getTileIdByPlace(place: TilePlace): string | undefined {
    return this.configStore.getTileIdByPlace(place);
  }

  public getTileIdByCoordinates(coordinates: Coordinates): string | undefined {
    return this.configStore.getTileIdByCoordinates(coordinates);
  }

  public async getSavedCurrentScreenId() {
    return (
      (await this.localClient.get<string>(this.localDataCurrentScreenIdKey)) ||
      ""
    );
  }

  public async saveCurrentScreenId(screenId: string) {
    await this.localClient.set(this.localDataCurrentScreenIdKey, screenId);
  }

  public getScreenTilesNumber(screenId: string) {
    const store = this.configStore;
    return Object.keys(store.getTilePlacesByScreen(screenId)).length;
  }

  public isDefaultDataLoaded() {
    return this.configStore.isDefaultDataLoaded;
  }

  protected async updateTilePlaces(places: TilePlaces) {
    const store = this.configStore;
    store.config.tilePlaces = {
      ...store.config.tilePlaces,
      ...places,
    };
    await this.saveConfig();
  }

  protected isPlaceAvailable(place: TilePlace, tileIdWhiteList: string[]) {
    const store = this.configStore;
    const occupiedTileId = store.getTileIdByPlace(place);
    if (occupiedTileId && !tileIdWhiteList.includes(occupiedTileId)) {
      return false;
    }
    if (
      place.x < 0 ||
      place.y < 0 ||
      place.x >= store.config.grid.columns ||
      place.y >= store.config.grid.rows
    ) {
      return false;
    }
    return true;
  }

  protected async loadConfig(params: InitParams) {
    const store = this.configStore;
    const result = await this.getConfigFromStorage(params);

    if (result.migration) {
      await this.setMigrationConfigBackupToStorage(result.migration.fromData);
    }

    console.log("Load config", result);
    store.config = result.data;
    store.isDefaultDataLoaded = result.isDefaultData;
    store.isLoaded = true;
    this.eventEmitterService.emit(EmittedEvent.CONFIG_LOADED);
  }

  protected async saveConfig() {
    const store = this.configStore;
    const data = cloneDeep(store.config);
    console.log("Save config", data);
    await this.setConfigToStorage(data);
    store.isDefaultDataLoaded = false;
  }

  protected async getConfigFromStorage(params: InitParams): Promise<{
    data: StorageConfigData;
    isDefaultData: boolean;
    migration?: {
      fromData: StorageConfigData;
    };
  }> {
    const data = await this.client.get<StorageConfigData>(this.configDataKey);
    if (!data) {
      return {
        data: this.getDefaultConfigData(params),
        isDefaultData: true,
      };
    }
    if (data.version !== this.storageMigrationService.getCurrentVersion()) {
      const result = this.storageMigrationService.migrate(data);
      return {
        data: result,
        isDefaultData: false,
        migration: {
          fromData: data,
        },
      };
    }
    return {
      data,
      isDefaultData: false,
    };
  }

  protected async setConfigToStorage(data: StorageConfigData): Promise<void> {
    await this.client.set(this.configDataKey, data);
  }

  protected async setMigrationConfigBackupToStorage(
    data: StorageConfigData
  ): Promise<void> {
    await this.client.set(this.configMigrationBackupDataKey, data);
  }

  protected getDefaultConfigData({
    windowWidth,
    windowHeight,
  }: InitParams): StorageConfigData {
    return {
      version: this.storageMigrationService.getCurrentVersion(),
      grid: this.gridHelperService.getAutoGridParams(windowWidth, windowHeight),
      screenIds: [DEFAULT_SCREEN_ID],
      screens: {
        default: {
          id: DEFAULT_SCREEN_ID,
          label: "Default",
        },
      },
      tilePlaces: {},
      tiles: {},
      style: {
        background: {
          type: "randomGradient",
          randomGradient: {
            type: "seed",
            seed: {
              seed: "49d320a6302363f8",
            },
          },
        },
        overlay: {
          color: "#000000",
          opacity: 0,
          blur: 0,
          blendMode: "normal",
        },
        onBackgroundTextColor: "auto",
        tile: {
          style: "ios",
        },
        theme: "sync",
      },
    };
  }
}
