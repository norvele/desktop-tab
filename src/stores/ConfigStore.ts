import { defineStore } from "pinia";
import type { Ref } from "vue";
import { computed, ref } from "vue";
import type { StorageConfigData } from "@/services/storageVersion/types";
import type { Coordinates, TilePlace, TilePlaces } from "@/types";

type InvertedTilePlaces = Record<string, string>;

export const ConfigStoreDefinition = defineStore("ConfigStore", () => {
  // config is always set at the start of the application
  const config = ref() as Ref<StorageConfigData>;
  const isDefaultDataLoaded = ref(false);
  const isLoaded = ref(false);

  const tileIdByPlaceKeyMap = computed(() => {
    return getInvertedTilePlaces(config.value.tilePlaces);
  });

  const tileIdByCoordinatesKeyMap = computed(() => {
    return getInvertedTilePlaces(config.value.tilePlaces, true);
  });

  const tilePlacesByScreen = computed(() => {
    return Object.entries(config.value.tilePlaces).reduce(
      (acc, [key, place]) => {
        if (!acc[place.screenId]) {
          acc[place.screenId] = {};
        }
        acc[place.screenId][key] = place;
        return acc;
      },
      {} as { [screenId: string]: TilePlaces }
    );
  });

  const getTileIdByPlace = (place: TilePlace): string | undefined => {
    return tileIdByPlaceKeyMap.value[getPlaceKey(place)];
  };

  const getTileIdByCoordinates = (
    coordinates: Coordinates
  ): string | undefined => {
    return tileIdByCoordinatesKeyMap.value[
      getPlaceKey({ ...coordinates, screenId: "" }, true)
    ];
  };

  const getTilePlacesByScreen = (screenId: string) => {
    return tilePlacesByScreen.value[screenId] || {};
  };

  return {
    config,
    isLoaded,
    isDefaultDataLoaded,
    tileIdByPlaceKeyMap,
    getTileIdByPlace,
    getTileIdByCoordinates,
    getTilePlacesByScreen,
  };
});

function getInvertedTilePlaces(
  tilePlaces: TilePlaces,
  onlyCoordinates = false
): InvertedTilePlaces {
  return Object.entries(tilePlaces).reduce((acc, [key, place]) => {
    acc[getPlaceKey(place, onlyCoordinates)] = key;
    return acc;
  }, {} as InvertedTilePlaces);
}

function getPlaceKey({ x, y, screenId }: TilePlace, onlyCoordinates = false) {
  if (onlyCoordinates) {
    return `${x}-${y}`;
  }
  return `${screenId}-${x}-${y}`;
}
