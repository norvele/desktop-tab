import { injectable } from "inversify";

type ColorSet = [string, string, string];

interface ThemeColors {
  baseBack: string;
  onBaseBack: string;
  onBaseBackContrast: string;
  onBaseBackBorder: string;

  primaryBack: string;
  primaryBackHover: string;
  onPrimaryBack: string;

  baseButtonBack: string;
  baseButtonBackHover: string;
  onBaseButtonBack: string;

  inputBack: string;
  onInputBack: string;
  onInputBackPlaceholder: string;

  tileBack: string;
}

const primarySet: ColorSet = ["#2980ef", "#3A8EF9", "#519cfb"];
const onPrimary = "#FFFFFF";
const lightNeutralSet: ColorSet = ["#F1F3F4", "#F1F3F4", "#dee0e2"];
const darkNeutralSet: ColorSet = ["#494E51", "#494E51", "#53595d"];

@injectable()
export class ThemeService {
  public getThemeColors(themeName: "light" | "dark"): ThemeColors {
    if (themeName === "dark") {
      return {
        baseBack: "#323639",
        onBaseBack: "#8A9199",
        onBaseBackContrast: "#FFFFFF",
        onBaseBackBorder: "#494E51",

        primaryBack: this.getColorFromSet(primarySet),
        primaryBackHover: this.getColorFromSet(primarySet, 1),
        onPrimaryBack: onPrimary,

        baseButtonBack: this.getColorFromSet(darkNeutralSet),
        baseButtonBackHover: this.getColorFromSet(darkNeutralSet, 1),
        onBaseButtonBack: "#FFFFFF",

        inputBack: "#1F2125",
        onInputBack: "#FFFFFF",
        onInputBackPlaceholder: "#8A9199",

        tileBack: "#323639",
      };
    }
    return {
      baseBack: "#FFFFFF",
      onBaseBack: "#8A9199",
      onBaseBackContrast: "#000000",
      onBaseBackBorder: "#EAEAEA",

      primaryBack: this.getColorFromSet(primarySet),
      primaryBackHover: this.getColorFromSet(primarySet, 1),
      onPrimaryBack: onPrimary,

      baseButtonBack: this.getColorFromSet(lightNeutralSet),
      baseButtonBackHover: this.getColorFromSet(lightNeutralSet, 1),
      onBaseButtonBack: "#000000",

      inputBack: "#F1F3F4",
      onInputBack: "#000000",
      onInputBackPlaceholder: "#8A9199",

      tileBack: "#F1F3F4",
    };
  }

  protected getColorFromSet(colorSet: ColorSet, offset = 0) {
    const middleIndex = Math.floor(colorSet.length / 2);
    return colorSet[middleIndex + offset];
  }
}
