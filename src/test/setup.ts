import "reflect-metadata";
import { createContainer } from "@/container";

export default function setupFunctionalTest() {
  const container = createContainer(false);

  return {
    container,
  };
}
