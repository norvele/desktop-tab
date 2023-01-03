import type { Coordinates, Icon } from "@/types";
import type { TileScreen } from "@/types";
import AppTileModal from "@/components/AppTileModal.vue";
import AppScreenModal from "@/components/AppScreenModal.vue";
import AppScreenDeleteModal from "@/components/AppScreenDeleteModal.vue";
import AppMultipleTilesAddModalContainer from "@/containers/AppMultipleTilesAddModalContainer.vue";
import AppWelcomeModalContainer from "@/containers/AppWelcomeModalContainer.vue";
import type { TileStyleUnion } from "@/types/configRelated/v3/styleTypes";

interface ModalInterfaces {
  screen: {
    props: {
      title: string;
      label: string;
    };
    callbacks: {
      save: (payload: { label: string }) => void;
    };
  };
  screenDelete: {
    props: {
      title: string;
      tilesNumber: number;
      screenList: TileScreen[];
      screenIdToDelete: string;
      getFreeScreenPlacesNumber: (screenId: string) => number;
    };
    callbacks: {
      submit: (payload: { newScreenId: string }) => void;
    };
  };
  tile: {
    props: {
      title: string;
      label: string;
      url: string;
      icon: Icon | undefined;
      tileStyle: TileStyleUnion;
      coordinates?: Coordinates;
    };
    callbacks: {
      save: (
        payload: {
          label: string;
          url: string;
          icon: Icon;
        },
        coordinates?: Coordinates
      ) => void;
    };
  };
  multipleTilesAddModal: {
    props: {
      // nothing
    };
    callbacks: {
      // nothing
    };
  };
  welcomeModal: {
    props: {
      // nothing
    };
    callbacks: {
      // nothing
    };
  };
}
export type ModalNames = keyof ModalInterfaces;
export type ModalProps<T extends ModalNames> = ModalInterfaces[T]["props"];
export type ModalCallbacks<T extends ModalNames> =
  ModalInterfaces[T]["callbacks"];
// Сраный вуй не позволяет использовать сложные типы для defineProps или defineEmits
// Поэтому в компонентах модалок это не переиспользовать
export type ModalEmits<T extends ModalNames> = {
  [K in keyof ModalCallbacks<T>]: (
    event: K,
    // @ts-ignore WTF
    payload: Parameters<ModalCallbacks<T>[K]>[0]
  ) => void;
}[keyof ModalCallbacks<T>] & {
  (event: "close"): void;
};

export const modalComponents: Record<ModalNames, any> = {
  tile: AppTileModal,
  screen: AppScreenModal,
  screenDelete: AppScreenDeleteModal,
  multipleTilesAddModal: AppMultipleTilesAddModalContainer,
  welcomeModal: AppWelcomeModalContainer,
};
export const modalNames = Object.keys(modalComponents) as ModalNames[];
