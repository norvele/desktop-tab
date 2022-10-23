import AppTileModal from "@/components/AppTileModal.vue";
import AppStyleModal from "@/components/AppStyleModal.vue";

interface ModalInterfaces {
  tile: {
    props: {
      title: string;
      label: string;
      url: string;
    };
    callbacks: {
      save: (payload: { label: string; url: string }) => void;
      delete: () => void;
    };
  };
  style: {
    props: {
      backgroundUrl: string;
      backgroundOverlay: number;
      backgroundBlur: number;
      gridColumns: number;
      gridRows: number;
    };
    callbacks: {
      save: (payload: {
        backgroundUrl: string;
        backgroundOverlay: number;
        backgroundBlur: number;
        gridColumns: number;
        gridRows: number;
      }) => void;
      input: (payload: {
        backgroundUrl: string;
        backgroundOverlay: number;
        backgroundBlur: number;
        gridColumns: number;
        gridRows: number;
      }) => void;
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
  style: AppStyleModal,
};
export const modalNames = Object.keys(modalComponents) as ModalNames[];
