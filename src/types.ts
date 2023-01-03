import type { DefineComponent } from "vue";

export interface SelectOption {
  value: string;
  label: string;
  isDisabled?: boolean;
}

export interface UiTab {
  id: string;
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

export interface TileScreen {
  id: string;
  label: string;
}

export interface TileDragDataTransfer {
  dataTransferType: "tile";
  mainTileId: string;
  otherTilesMap: {
    [tileId: string]: Coordinates; // relative to the main tile
  };
}

export enum EmittedEvent {
  CONFIG_LOADED = "config:loaded",
  BROWSER_OPENED_TABS_UPDATED = "browser:opened-tabs-updated",
}

export interface DropdownMenuItem {
  label: string;
  isDisabled?: boolean;
  description?: string;
  onClick?: () => void;
  items?: DropdownMenuItems;
  icon?: string; // url
}
export type DropdownMenuItems = DropdownMenuItem[] | DropdownMenuItem[][];
export type AsyncDropdownMenuItems = () => Promise<DropdownMenuItems>;

export interface BrowserTab {
  id: string;
  iconUrl: string;
  title: string;
  url: string;
}

export interface BrowserTopSite {
  title: string;
  url: string;
}

export interface TileSource {
  id: string;
  iconUrl: string;
  title: string;
  url: string;
}

export type VueComponent = DefineComponent<
  Record<any, any>,
  Record<any, any>,
  any
>;

export interface StorageClientServiceInterface {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
}

export interface BrowserService {
  init(): Promise<void>;
  openUrl(url: string): void;
  openUrlInNewTab(url: string): void;
  openUrlInNewWindow(
    url: string,
    params?: { width: number; height: number }
  ): void;
  getOpenedTabs(): BrowserTab[];
  subscribeToOpenedTabs(callback: (tabs: BrowserTab[]) => void): string;
  unsubscribeFromOpenedTabs(id: string): void;
  getTopSites(): Promise<BrowserTopSite[]>;
}

export type LastReadonlyArrayElement<T extends readonly any[]> =
  T extends readonly [...infer _, infer Last] ? Last : T[0];
export type OmitFirstReadonlyArrayElement<T extends readonly any[]> =
  T extends readonly [infer _, ...infer Rest] ? Rest : never;
