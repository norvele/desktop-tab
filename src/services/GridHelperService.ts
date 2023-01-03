import type { Coordinates, GridParams, TilePlace, TilePlaces } from "@/types";
import { cloneDeep, pick, pickBy } from "lodash";
import { injectable } from "inversify";

type InvertedTilePlaces = Record<string, string>;

@injectable()
export class GridHelperService {
  public getAutoGridParams(windowWidth: number, windowHeight: number) {
    const optimalTileSize = 120;
    const columns = Math.floor(windowWidth / optimalTileSize);
    const rows = Math.floor(windowHeight / optimalTileSize);

    return {
      columns,
      rows,
    };
  }

  public getAutoGridParamsByNeededPlacesNumber(
    windowWidth: number,
    windowHeight: number,
    neededPlacesNumber: number
  ) {
    const startParams = this.getAutoGridParams(windowWidth, windowHeight);
    if (startParams.columns * startParams.rows >= neededPlacesNumber) {
      return startParams;
    }
    let columns = startParams.columns;
    let rows = startParams.rows;
    while (columns * rows < neededPlacesNumber) {
      columns++;
      rows++;
    }
    return {
      columns,
      rows,
    };
  }

  public getFirstFreeCoordinates(
    { rows, columns }: GridParams,
    screenId: string,
    filledPlaces: TilePlaces
  ): Coordinates | undefined {
    const invertedFilledPlaces = this.getTileIdByPlaceKeyMap(filledPlaces);
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const key = this.getPlaceKey({
          x,
          y,
          screenId,
        });
        if (!invertedFilledPlaces[key]) {
          return { x, y };
        }
      }
    }

    return undefined;
  }

  public isPossibleToChangeGridParams(
    { rows, columns }: GridParams,
    places: TilePlaces
  ) {
    const placesMap = this.separatePlacesByScreens(places);
    const possiblePlacesInScreen = rows * columns;
    return Object.values(placesMap).every((screenPlaces) => {
      return Object.keys(screenPlaces).length <= possiblePlacesInScreen;
    });
  }

  public normalizePlaces(
    { rows, columns }: GridParams,
    places: TilePlaces
  ): TilePlaces {
    const placeByScreenMap = this.separatePlacesByScreens(places);
    const screenIds = Object.keys(placeByScreenMap);
    const tileIdByPlaceKeyMap = this.getTileIdByPlaceKeyMap(places);

    // dynamic variables
    const freeCoordinatesByScreenMap = screenIds.reduce((acc, screenId) => {
      acc[screenId] = [];
      return acc;
    }, {} as { [screenId: string]: Coordinates[] });
    const overloadPlaceByScreenMap = cloneDeep(placeByScreenMap);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        screenIds.forEach((screenId) => {
          const place = { x, y, screenId };
          const key = this.getPlaceKey(place);
          const tileId = tileIdByPlaceKeyMap[key];
          if (tileId) {
            delete overloadPlaceByScreenMap[screenId][tileId];
          } else {
            freeCoordinatesByScreenMap[screenId].push({ x, y });
          }
        });
      }
    }

    const newPlaces = cloneDeep(places);
    screenIds.forEach((screenId) => {
      Object.keys(overloadPlaceByScreenMap[screenId]).forEach((tileId) => {
        const freeCoordinate = freeCoordinatesByScreenMap[screenId].shift();
        if (freeCoordinate) {
          newPlaces[tileId] = {
            ...freeCoordinate,
            screenId,
          };
        } else {
          throw new Error("Not enough free coordinates");
        }
      });
    });

    return newPlaces;
  }

  public getTilePlacesByScreenId(places: TilePlaces, screenId: string) {
    return pickBy(places, (place) => place.screenId === screenId);
  }

  // Return only moved places
  public getMovedTilePlacesToScreen(
    gridParams: GridParams,
    allPlaces: TilePlaces,
    movedTileIds: string[],
    newScreenId: string
  ): TilePlaces {
    const movedPlaces = pick(allPlaces, movedTileIds);
    const tileIdByPlaceKeyMap = this.getTileIdByPlaceKeyMap(allPlaces);
    let freeCoordinates = this.getScreenFreeCoordinatesList(
      gridParams,
      allPlaces,
      newScreenId
    );
    if (movedTileIds.length > freeCoordinates.length) {
      throw new Error("Not enough free coordinates");
    }
    Object.entries(movedPlaces).forEach(([tileId, place]) => {
      const key = this.getPlaceKey({
        ...place,
        screenId: newScreenId,
      });
      if (tileIdByPlaceKeyMap[key]) {
        const freeCoordinate = freeCoordinates[0];
        const newKey = this.getPlaceKey({
          ...freeCoordinate,
          screenId: newScreenId,
        });
        movedPlaces[tileId] = {
          ...freeCoordinate,
          screenId: newScreenId,
        };
        freeCoordinates = freeCoordinates.slice(1);
        tileIdByPlaceKeyMap[newKey] = tileId;
      } else {
        movedPlaces[tileId].screenId = newScreenId;
        freeCoordinates = freeCoordinates.filter(
          ({ x, y }) => place.x !== x || place.y !== y
        );
        tileIdByPlaceKeyMap[key] = tileId;
      }
    });
    return movedPlaces;
  }

  public getTileIdsBetween(
    screenId: string,
    allPlaces: TilePlaces,
    coord1: Coordinates,
    coord2: Coordinates
  ) {
    const x1 = Math.min(coord1.x, coord2.x);
    const x2 = Math.max(coord1.x, coord2.x);
    const y1 = Math.min(coord1.y, coord2.y);
    const y2 = Math.max(coord1.y, coord2.y);
    const tileIdByPlaceKeyMap = this.getTileIdByPlaceKeyMap(allPlaces);

    const tileIds: string[] = [];
    for (let y = y1; y <= y2; y++) {
      for (let x = x1; x <= x2; x++) {
        const key = this.getPlaceKey({ x, y, screenId });
        if (tileIdByPlaceKeyMap[key]) {
          tileIds.push(tileIdByPlaceKeyMap[key]);
        }
      }
    }

    return tileIds;
  }

  public getTileIdByPlaceKeyMap(data: TilePlaces, onlyCoordinates = false) {
    return Object.entries(data).reduce((acc, [key, place]) => {
      acc[this.getPlaceKey(place, onlyCoordinates)] = key;

      return acc;
    }, {} as InvertedTilePlaces);
  }

  public getPlaceKey({ x, y, screenId }: TilePlace, onlyCoordinates = false) {
    if (onlyCoordinates) {
      return `${x}-${y}`;
    }
    return `${screenId}-${x}-${y}`;
  }

  protected separatePlacesByScreens(tilePlaces: TilePlaces): {
    [screenId: string]: TilePlaces;
  } {
    return Object.entries(tilePlaces).reduce((acc, [key, place]) => {
      if (!acc[place.screenId]) {
        acc[place.screenId] = {};
      }
      acc[place.screenId][key] = place;
      return acc;
    }, {} as { [screenId: string]: TilePlaces });
  }

  protected getScreenFreeCoordinatesList(
    { columns, rows }: GridParams,
    places: TilePlaces,
    screenId: string
  ) {
    const tileIdByPlaceKeyMap = this.getTileIdByPlaceKeyMap(places);
    const screenFreeCoordinates = [] as Coordinates[];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const key = this.getPlaceKey({
          x,
          y,
          screenId,
        });
        if (!tileIdByPlaceKeyMap[key]) {
          screenFreeCoordinates.push({ x, y });
        }
      }
    }
    return screenFreeCoordinates;
  }
}
