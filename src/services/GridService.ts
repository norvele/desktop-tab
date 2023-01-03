import type { GridStoreDefinition } from "@/stores/GridStore";
import type { StorageService } from "@/services/StorageService";
import type { GridParams } from "@/types";
import { inject, injectable } from "inversify";
import { ServiceType } from "@/serviceTypes";
import type { GridHelperService } from "@/services/GridHelperService";
import union from "lodash/union";

@injectable()
export class GridService {
  constructor(
    @inject(ServiceType.GridStoreDefinition)
    protected gridStoreDefinition: typeof GridStoreDefinition,
    @inject(ServiceType.StorageService)
    protected storageService: StorageService,
    @inject(ServiceType.GridHelperService)
    protected gridHelperService: GridHelperService
  ) {}

  public getGridParams() {
    return this.storageService.getConfig().grid;
  }

  public getTilePlaces() {
    return this.storageService.getConfig().tilePlaces;
  }

  public getScreenTilesNumber(screenId: string) {
    return this.storageService.getScreenTilesNumber(screenId);
  }

  public isPossibleToChangeGridParams(gridParams: GridParams) {
    return this.gridHelperService.isPossibleToChangeGridParams(
      gridParams,
      this.getTilePlaces()
    );
  }

  public getFreeScreenPlacesNumber(screenId: string) {
    const { columns, rows } = this.getGridParams();
    const placesNumber = columns * rows;
    return placesNumber - this.getScreenTilesNumber(screenId);
  }

  public async updateGridParams(grid: GridParams) {
    await this.storageService.updateGrid(grid);
  }

  public getSelectedTileIds() {
    return this.gridStoreDefinition().selectedTileIds;
  }

  public selectTiles(tileIds: string[]) {
    const store = this.gridStoreDefinition();
    store.selectedTileIds = union(store.selectedTileIds, tileIds);
  }

  public setSelectedTiles(tileIds: string[]) {
    const store = this.gridStoreDefinition();
    store.selectedTileIds = tileIds;
  }

  public isTileSelected(tileId: string) {
    const store = this.gridStoreDefinition();
    return store.selectedTileIds.includes(tileId);
  }
}
