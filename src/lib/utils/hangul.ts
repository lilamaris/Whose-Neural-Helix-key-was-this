const CHO: string[] = [
    "ㄱ",
    "ㄲ",
    "ㄴ",
    "ㄷ",
    "ㄸ",
    "ㄹ",
    "ㅁ",
    "ㅂ",
    "ㅃ",
    "ㅅ",
    "ㅆ",
    "ㅇ",
    "ㅈ",
    "ㅉ",
    "ㅊ",
    "ㅋ",
    "ㅌ",
    "ㅍ",
    "ㅎ"
];

export function getInitials(text: string): string {
    let result = "";
    for (const ch of text) {
        const code = ch.charCodeAt(0);
        if (code >= 0xac00 && code <= 0xd7a3) {
            const syllIndex = code - 0xac00;
            const choIndex = Math.floor(syllIndex / (21 * 28));
            result += CHO[choIndex];
        } else {
            result += ch;
        }
    }

    return result;
}
