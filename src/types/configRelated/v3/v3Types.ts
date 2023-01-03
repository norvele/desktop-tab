import type { V2 } from "@/types/configRelated/v2/v2Types";
import type { AppStyle } from "@/types/configRelated/v3/styleTypes";

export interface V3
  extends Pick<V2, "grid" | "screenIds" | "screens" | "tilePlaces" | "tiles"> {
  style: AppStyle;
}
