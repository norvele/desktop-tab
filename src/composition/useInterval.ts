import { onBeforeUnmount, onMounted } from "vue";

interface Params {
  immediate?: boolean;
}

export function useInterval(callback: () => void, ms: number, params?: Params) {
  let interval: any;

  onMounted(() => {
    interval = setInterval(callback, ms);
    if (params?.immediate) {
      callback();
    }
  });

  onBeforeUnmount(() => {
    clearInterval(interval);
  });
}
