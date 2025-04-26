import { writable } from "svelte/store";

const stored = typeof localStorage !== "undefined" ? localStorage.getItem("locale") : null;
export const locale = writable<string>(stored || "ko");

locale.subscribe((lang) => {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("locale", lang);
    }
});
