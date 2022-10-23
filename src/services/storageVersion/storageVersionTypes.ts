export interface V0 {
  tiles: Array<{
    id: string;
    url: string;
    label: string;
    icon: {
      src: string;
      symbol: string;
      color: string;
    };
  }>;
  style: {
    backgroundUrl: string;
    backgroundOverlay: number;
  };
}

export interface V1 {
  tileLists: Array<{
    id: string;
    label: string;
    maxColumnCount: number;
    tiles: Array<{
      id: string;
      url: string;
      label: string;
      icon: {
        src: string;
        symbol: string;
        color: string;
      };
    }>;
  }>;
  style: {
    backgroundUrl: string;
    backgroundOverlay: number;
  };
}

export interface V2 {
  grid: {
    columns: number;
    rows: number;
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
  };
}
