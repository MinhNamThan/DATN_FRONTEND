import { createPinia } from "pinia";
export { storeToRefs } from "pinia";
export * from "./account";
export * from "./place";
export * from "./box";
export * from "./camera";
export * from "./notification";

const pinia = createPinia();

export default pinia;
