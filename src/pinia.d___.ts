import "pinia";
import type { ContainerInterface } from "@/container";

declare module "pinia" {
  export interface PiniaCustomProperties {
    container: ContainerInterface;
  }
}
