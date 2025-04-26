<script lang="ts">
    import type { DollStatus } from "$lib/types";
    import { locale } from "$stores/localeStore";
    import { translations } from "$lib/utils/i18n";
    let labels = $derived(translations[$locale]);

    const { status }: { status: Record<keyof DollStatus, number> } = $props();
</script>

<div class="bg-base-100 rounded-box overflow-hidden p-4 shadow">
    <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        {#each Object.entries(status) as [key, value]}
            <div class="rounded-box flex items-center justify-between bg-[#51585c] px-2 text-white">
                <div class="flex items-center gap-1 overflow-hidden">
                    <img class="w-8" src={`/imgs/common/status/${key}.webp`} alt={key} />
                    <span class="text-s truncate">{labels[key] ?? key}</span>
                </div>
                <span class="text-s">{value}</span>
            </div>
        {/each}
    </div>
</div>
