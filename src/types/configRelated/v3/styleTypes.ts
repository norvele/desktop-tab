type PartOfParams<KEY extends string, PAYLOAD extends Record<string, any>> = {
  type: KEY;
} & Record<KEY, PAYLOAD>;

export interface AppStyle {
  background: BackgroundParams;
  overlay: OverlayParams;
  onBackgroundTextColor: OnBackgroundTextColorUnion;
  tile: TileParams;
  theme: ThemeUnion;
}

// Background

type PartOfBackgroundParams<
  KEY extends "url" | "randomGradient",
  PAYLOAD extends Record<string, any>
> = PartOfParams<KEY, PAYLOAD>;

type PartOfBackgroundRandomGradientParams<
  KEY extends "seed" | "autoChange",
  PAYLOAD extends Record<string, any>
> = PartOfParams<KEY, PAYLOAD>;

type BackgroundRandomGradientSeedPart = PartOfBackgroundRandomGradientParams<
  "seed",
  {
    seed: string;
  }
>;

export const intervalUnits = [
  "second",
  "minute",
  "hour",
  "day",
  "week",
  "month",
] as const;
export type IntervalUnit = typeof intervalUnits[number];
export interface AutoChangeParams {
  interval: number;
  unit: IntervalUnit;
}

type BackgroundRandomGradientAutoChangePart =
  PartOfBackgroundRandomGradientParams<"autoChange", AutoChangeParams>;

export type BackgroundUrlPart = PartOfBackgroundParams<
  "url",
  {
    url: string;
  }
>;
export type BackgroundRandomGradientPart = PartOfBackgroundParams<
  "randomGradient",
  BackgroundRandomGradientSeedPart | BackgroundRandomGradientAutoChangePart
>;
export type BackgroundParams = BackgroundUrlPart | BackgroundRandomGradientPart;

// Overlay

export const blendModes = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "hard-light",
  "soft-light",
  "difference",
  "exclusion",
  "hue",
  "saturation",
  "color",
  "luminosity",
] as const;
export type BlendModeUnit = typeof blendModes[number];

export interface OverlayParams {
  blur: number;
  color: string;
  opacity: number;
  blendMode: BlendModeUnit;
}

// Tile

export interface TileParams {
  style: TileStyleUnion;
}

export enum TileStyle {
  square = "square",
  circle = "circle",
  ios = "ios",
  onlyIcon = "only-icon",
}
export type TileStyleUnion = `${TileStyle}`;

export enum OnBackgroundTextColor {
  light = "light",
  dark = "dark",
  auto = "auto",
}
export type OnBackgroundTextColorUnion = `${OnBackgroundTextColor}`;

// Theme

export enum Theme {
  light = "light",
  dark = "dark",
  sync = "sync",
}
export type ThemeUnion = `${Theme}`;
