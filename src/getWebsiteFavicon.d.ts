declare module "get-website-favicon" {
  interface Icon {
    src: string;
    sizes: string; // '', 114x114, 152x152, ...
    type: string; // '', image/x-icon, ...
    origin: string;
  }
  interface Result {
    url: string;
    icons: Icon[];
  }
  export default function getFavicons(url: string): Promise<Result>;
}
