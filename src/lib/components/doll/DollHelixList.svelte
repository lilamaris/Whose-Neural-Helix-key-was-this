<script lang="ts">
    import type { ExtendedHelixKey } from "$stores/dollStore";
    const {
        keys,
        hideOwner = true
    }: {
        keys: ExtendedHelixKey[];
        hideOwner?: boolean;
    } = $props();
    import { locale } from "$stores/localeStore";
    import { translations } from "$lib/utils/i18n";

    let labels = $derived(translations[$locale]);

    const maxSlots = 3;
    const emptyCount = $derived((maxSlots - (keys.length % maxSlots)) % maxSlots);
</script>

<div class="bg-base-100 rounded-box overflow-hidden p-4 shadow-sm">
    <div class="grid grid-cols-1 gap-2 lg:grid-cols-3">
        {#each keys as key}
            {#if key.name.length}
                <div class="rounded-box bg-base-300 flex flex-col md:h-[9rem]">
                    <!-- Helix 키 개요 -->
                    <div class="flex">
                        <img
                            class="flex h-20 w-20 shrink-0"
                            src={`/imgs/${key.owner}/${key.type}.webp`}
                            alt={key.type}
                        />
                        <div class="flex flex-1 flex-col items-start gap-1 truncate">
                            <div class="flex items-center gap-1">
                                <span
                                    class="bg-info text-info-content rounded-field text-s mt-2 px-1 font-bold"
                                >
                                    {#if !hideOwner}
                                        {labels[key.owner] ?? key.owner}의
                                    {/if}
                                    {labels[key.type] ?? key.type}
                                </span>
                            </div>
                            <span class="text-s text-base-content text-xs font-bold"
                                >{key.name}</span
                            >
                        </div>
                    </div>

                    <!-- Helix 키 설명 -->
                    <div class="helix-description mb-1 flex items-start overflow-y-scroll px-2">
                        <span class="text-s text-base-content-100 font-bold">{key.description}</span
                        >
                    </div>
                </div>
            {:else}
                <div
                    class="border-base-300 rounded-box flex min-h-[5rem] items-center justify-center border-2 border-dashed"
                >
                    <h4 class="text-m text-base-300 text-center">
                        {labels[key.type] ?? key.type} 없어!!
                    </h4>
                </div>
            {/if}
        {/each}
        {#if emptyCount > 0}
            {#each Array(emptyCount) as _}
                <div
                    class="rounded-box border-base-300 flex flex-col border-2 border-dashed md:h-[9rem]"
                ></div>
            {/each}
        {/if}
    </div>
</div>

<style lang="postcss" module>
    @reference "tailwindcss";

    .helix-description::-webkit-scrollbar {
        width: 6px;
    }

    .helix-description::-webkit-scrollbar-thumb {
        background-color: var(--color-base-200);
        border-radius: 6px;
    }
</style>
