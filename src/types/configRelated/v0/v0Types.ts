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
