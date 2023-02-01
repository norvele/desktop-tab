import {
  getBrowserService,
  getStyleService,
  getThemeService,
} from "@/composition/injectors";
import { computed } from "vue";

export function useTheme() {
  const styleService = getStyleService();
  const themeService = getThemeService();
  const browserService = getBrowserService();

  const browserTheme = computed(() => browserService.getTheme());
  const styleTheme = computed(() => styleService.getStyle().theme);
  const resultTheme = computed(() => {
    if (styleTheme.value === "sync") {
      return browserTheme.value;
    }
    return styleTheme.value;
  });

  const isDark = computed(() => resultTheme.value === "dark");
  const isLight = computed(() => resultTheme.value === "light");

  const colors = computed(() => {
    const theme = isDark.value ? "dark" : "light";
    return themeService.getThemeColors(theme);
  });

  return { colors, isDark, isLight };
}
