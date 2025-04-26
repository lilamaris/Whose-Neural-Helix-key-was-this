import { derived, readable, writable } from "svelte/store";
import dollData from "$lib/data/dolls.jsonl?raw";
import preferHelixKey from "$lib/data/preferHelixKey.jsonl?raw";
import { parseDollData } from "$lib/utils/parser";
import {
    SpecialNeuralHelixType,
    type Doll,
    type NeuralHelixKey,
    type PreferHelixKey,
    type UniqueNeuralHelixType
} from "$lib/types";

// Initial Doll Data
const initialDolls: Doll[] = parseDollData(dollData);
export const dolls = readable<Doll[]>(initialDolls);

// Selected Doll
export const selectedDoll = writable<Doll | null>(null);

// Initial Prefer Helix Keys

export interface ExtendedHelixKey extends NeuralHelixKey {
    owner: string;
    type: SpecialNeuralHelixType | UniqueNeuralHelixType;
}

const initialPreferHelixKeys: PreferHelixKey[] = parseDollData(preferHelixKey);
export const preferHelixKeys = readable<PreferHelixKey[]>(initialPreferHelixKeys);
export const recommendCommonKeys = derived(
    [dolls, selectedDoll, preferHelixKeys],
    ([$dolls, $selectedDoll, $preferHelixKeys]) => {
        if ($selectedDoll == null) return [];

        const preferData = $preferHelixKeys.find((d) => d.id === $selectedDoll.id);
        if (preferData == null) return [];

        const preferCommonKeys = preferData.preferCommonKey
            .map((id: string) => {
                const doll = $dolls.find((d) => d.id === id);
                if (doll == null) return null;
                const mapped: ExtendedHelixKey = {
                    owner: doll.id,
                    type: SpecialNeuralHelixType.common,
                    ...doll.neural_helix.special.common
                };
                return mapped;
            })
            .filter((key): key is ExtendedHelixKey => key !== null);

        return preferCommonKeys;
    }
);
