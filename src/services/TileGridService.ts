import type { Coordinates, GridParams, TilePlace, TilePlaces } from "@/types";
import { cloneDeep } from "lodash";

type InvertedTilePlaces = Record<string, string>;

export class TileGridService {
  public getFirstFreeCoordinates(
    { rows, columns }: GridParams,
    screenId: string,
    filledPlaces: TilePlaces
  ): Coordinates | undefined {
    const invertedFilledPlaces = this.getInvertedTilePlaces(filledPlaces);
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

  public getFittedTilePlaces(
    { rows, columns }: GridParams,
    screenId: string,
    filledPlaces: TilePlaces
  ): TilePlaces {
    const invertedFilledPlaces = this.getInvertedTilePlaces(filledPlaces);
    const freeCoordinates = [] as Coordinates[];
    const newFilledPlaces = cloneDeep(filledPlaces);
    const notFittingPlaces = cloneDeep(filledPlaces);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const key = this.getPlaceKey({
          x,
          y,
          screenId,
        });
        if (invertedFilledPlaces[key]) {
          delete notFittingPlaces[invertedFilledPlaces[key]];
        } else {
          freeCoordinates.push({ x, y });
        }
      }
    }

    Object.keys(notFittingPlaces).forEach((tileId) => {
      const freeCoordinate = freeCoordinates.shift();
      if (freeCoordinate) {
        newFilledPlaces[tileId] = {
          ...freeCoordinate,
          screenId,
        };
      } else {
        throw new Error("Not enough free coordinates");
      }
    });

    return newFilledPlaces;
  }

  public getUsedScreenIds(filledPlaces: TilePlaces) {
    return Object.values(filledPlaces).map(({ screenId }) => screenId);
  }

  public getInvertedTilePlaces(data: TilePlaces) {
    return Object.entries(data).reduce((acc, [key, place]) => {
      acc[this.getPlaceKey(place)] = key;

      return acc;
    }, {} as InvertedTilePlaces);
  }

  public getPlaceKey({ x, y, screenId }: TilePlace) {
    return `${screenId}-${x}-${y}`;
  }
}
