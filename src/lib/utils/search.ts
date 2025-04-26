import { getInitials } from "./hangul";

function normalize(str: string): string {
    return str.toLowerCase().replace(/\s+/g, "");
}

export function hangulMatch(target: string, searchTerm: string): boolean {
    const qRaw = searchTerm.trim();
    if (!qRaw) return true;

    const loTarget = normalize(target);
    const loQuery = normalize(qRaw);

    if (loTarget.includes(loQuery)) return true;

    const initials = normalize(getInitials(target));
    if (initials.includes(loQuery)) return true;

    return false;
}
