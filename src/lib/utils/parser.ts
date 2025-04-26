import type { Doll } from "../types";

export function parseDollData<T>(jsonlContent: string): T[] {
    return jsonlContent
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));
}
