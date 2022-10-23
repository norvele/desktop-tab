import type { DefineComponent } from "vue";

export interface SelectOption {
  value: string;
  label: string;
}

export interface Icon {
  src: string;
  symbol: string;
  color: string;
}

export interface Tile {
  id: string;
  url: string;
  label: string;
  icon: Icon;
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface TilePlace extends Coordinates {
  screenId: string;
}

export type TilePlaces = Record<string, TilePlace>;

export interface GridParams {
  columns: number;
  rows: number;
}

export interface AppStyle {
  backgroundUrl: string;
  backgroundOverlay: number;
  backgroundBlur: number;
}

export interface TileDragDataTransfer {
  mainTileId: string;
  otherTilesMap: {
    [tileId: string]: {
      x: number; // relative to main tile
      y: number; // relative to main tile
    };
  };
}

export type VueComponent = DefineComponent<{}, {}, any>;

export interface StorageClientServiceInterface {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export type LastReadonlyArrayElement<T extends readonly any[]> =
  T extends readonly [...infer _, infer Last] ? Last : T[0];
export type OmitFirstReadonlyArrayElement<T extends readonly any[]> =
  T extends readonly [infer _, ...infer Rest] ? Rest : never;
