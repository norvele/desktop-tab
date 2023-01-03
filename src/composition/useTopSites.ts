import { computed } from "vue";
import { getAppService, getFaviconService } from "@/composition/injectors";
import type { TileSource } from "@/types";

export function useTopSites() {
  const appService = getAppService();
  const faviconService = getFaviconService();
  const browserTopSites = computed(() => appService.getTopSites());

  const topSites = computed(() => {
    return browserTopSites.value.map(({ title, url }) => {
      const id = title + url;
      const iconUrl = faviconService.getIconSrc(url);
      return {
        id,
        title,
        url,
        iconUrl,
      } as TileSource;
    });
  });

  return {
    topSites,
  };
}
