import { writable, derived } from "svelte/store";
import { dolls } from "./dollStore";
import { hangulMatch } from "$lib/utils/search";
import type { Doll, DollStatus } from "$lib/types";

export const searchTerm = writable<string>("");
export const criteria = writable<keyof DollStatus | "rare" | "name">("rare");
export const sortOrder = writable<boolean>(true);
export const country = writable<("cn" | "ko")[]>(["cn", "ko"]);

const rareRank: Record<Doll["rare"], number> = { ssr: 0, sr: 1 };

function compareBy(a: Doll, b: Doll, c: keyof DollStatus | "rare" | "name", asc: boolean) {
    let v = 0;
    if (c === "name") v = a.name.localeCompare(b.name, "ko");
    else if (c === "rare")
        v = rareRank[a.rare] - rareRank[b.rare] || a.name.localeCompare(b.name, "ko");
    else v = (b.status?.[c] ?? 0) - (a.status?.[c] ?? 0) || a.name.localeCompare(b.name, "ko");

    return asc ? v : -v;
}

export const filteredDolls = derived(
    [dolls, searchTerm, criteria, country, sortOrder],
    ([$dolls, $searchTerm, $criteria, $country, $sortOrder]) => {
        const q = $searchTerm.trim();
        const searched = $dolls.filter(
            (d) =>
                $country.some((c) => d.release.includes(c)) &&
                (hangulMatch(d.name, q) ||
                    hangulMatch(d.neural_helix.special.common.name, q) ||
                    d.id.includes(q))
        );

        return [...searched].sort((a, b) => compareBy(a, b, $criteria, $sortOrder));
    }
);
