import type { GridHelperService } from "@/services/GridHelperService";
import type { StorageService } from "@/services/StorageService";
import type { TilePlace, TilePlaces, TileSource } from "@/types";
import type { FaviconService } from "@/services/FaviconService";
import type { Coordinates, Tile } from "@/types";
import { getRandomString } from "@/utils/getRandomString";
import { inject, injectable } from "inversify";
import { ServiceType } from "@/serviceTypes";

@injectable()
export class TileService {
  constructor(
    @inject(ServiceType.GridHelperService)
    protected gridHelperService: GridHelperService,
    @inject(ServiceType.StorageService)
    protected storageService: StorageService,
    @inject(ServiceType.FaviconService) protected faviconService: FaviconService
  ) {}

  public getTiles() {
    return this.storageService.getConfig().tiles;
  }

  public getTileById(tileId: string): Tile | undefined {
    return this.getTiles()[tileId];
  }

  public async addTileFromSource(
    screenId: string,
    source: TileSource,
    coordinates?: Coordinates
  ) {
    const icon = await this.faviconService.getIcon(source.url, source.title);
    await this.addTile(
      screenId,
      {
        label: source.title,
        url: source.url,
        icon,
      },
      coordinates
    );
  }

  public async bulkAddTilesFromSources(
    screenId: string,
    sources: TileSource[]
  ) {
    for (const source of sources) {
      await this.addTileFromSource(screenId, source);
    }
  }

  public async addTile(
    screenId: string,
    payload: Pick<Tile, "label" | "url" | "icon">,
    coordinates?: Coordinates
  ) {
    const config = this.storageService.getConfig();
    const coords =
      coordinates ||
      this.gridHelperService.getFirstFreeCoordinates(
        config.grid,
        screenId,
        config.tilePlaces
      );

    if (!coords) {
      throw new Error("No empty cells");
    }

    const tile: Tile = {
      ...payload,
      id: getRandomString(10),
    };
    const place: TilePlace = {
      screenId,
      ...coords,
    };

    await this.storageService.addTile(tile, place);
  }

  public async updateTile(
    payload: Pick<Tile, "id" | "label" | "url" | "icon">
  ) {
    await this.storageService.updateTile({
      ...payload,
    });
  }

  public async deleteTiles(tileIds: string[]) {
    await this.storageService.deleteTiles(tileIds);
  }

  public async moveTilesToScreen(tileIds: string[], screenId: string) {
    await this.storageService.moveTilesToScreen(tileIds, screenId);
  }

  public async moveTilesSafely(movedNewTilePlaces: TilePlaces) {
    return this.storageService.moveTilesSafely(movedNewTilePlaces);
  }
}
