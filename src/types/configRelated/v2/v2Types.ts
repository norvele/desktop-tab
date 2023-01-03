export interface V2 {
  grid: {
    columns: number;
    rows: number;
  };
  screenIds: string[];
  screens: {
    [screenId: string]: {
      id: string;
      label: string;
    };
  };
  tilePlaces: {
    [tileId: string]: {
      screenId: string;
      x: number;
      y: number;
    };
  };
  tiles: {
    [tileId: string]: {
      id: string;
      url: string;
      label: string;
      icon: {
        src: string;
        symbol: string;
        color: string;
      };
    };
  };
  style: {
    backgroundUrl: string;
    backgroundOverlay: number;
    backgroundBlur: number;
    tileStyle: "square" | "circle" | "ios";
  };
}
