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
