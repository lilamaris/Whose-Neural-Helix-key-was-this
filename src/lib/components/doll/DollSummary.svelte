<script lang="ts">
    import type { Doll } from "$lib/types";
    import { locale } from "$stores/localeStore";
    import { translations } from "$lib/utils/i18n";

    const { doll }: { doll: Doll } = $props();
    let isSSR = $derived(doll.rare === "ssr");
    let labels = $derived(translations[$locale]);
</script>

<div
    class="bg-base-100 rounded-box flex flex-col justify-center gap-4 overflow-hidden p-4 shadow-sm md:flex-row md:justify-normal"
>
    <div
        class="rounded-box relative flex size-[clamp(10rem,25vw,15rem)] shrink-0 self-center justify-self-center"
        class:SSR-grad={isSSR}
        class:SR-grad={!isSSR}
    >
        <div class="absolute top-1 left-1 flex items-center gap-2">
            <span
                class="bg-base-300/50 text-base-content rounded-field flex items-center px-1 py-0.5 font-bold"
            >
                <img
                    class="w-6"
                    src={`/imgs/common/status/${doll.role.id}.webp`}
                    alt={doll.role.id}
                />
                {labels[doll.role.id] ?? doll.role.name}
            </span>
        </div>
        <img
            class="rounded-box object-cover"
            src={`/imgs/${doll.id}/portrait.png`}
            alt={doll.name}
        />
    </div>
    <div class="text-base-content flex flex-col gap-2">
        <div class="flex flex-wrap overflow-hidden">
            <h1 class="truncate text-xl font-bold">{doll.name}</h1>
            <span class=" text-l text-base-content-100 truncate capitalize">{doll.id}</span>
        </div>
        <p class="text-base-content-100 line-clamp-1 xl:line-clamp-5">
            {doll.description.length ? doll.description : `${doll.name} 최고다!!`}
        </p>
        <div class="mt-auto flex flex-col gap-y-1">
            <div class="flex items-center gap-2">
                <span class="text-base-content font-bold">속성</span>
                {#each doll.affinities?.id ?? {} as affinity}
                    <span
                        class="bg-info text-info-content rounded-field flex items-center truncate py-0.5 pr-1 font-bold"
                    >
                        <img
                            class="w-6"
                            src={`/imgs/common/status/${affinity}.webp`}
                            alt={affinity}
                        />
                        {labels[affinity] ?? affinity}
                    </span>
                {/each}
            </div>
            <div class="flex items-center gap-2">
                <span class="text-base-content font-bold">약점</span>
                {#each doll.weaknesses?.id ?? {} as weakness}
                    <span
                        class="bg-error text-error-content rounded-field flex items-center truncate py-0.5 pr-1 font-bold"
                    >
                        <img
                            class="w-6"
                            src={`/imgs/common/status/${weakness}.webp`}
                            alt={weakness}
                        />
                        {labels[weakness] ?? weakness}
                    </span>
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="postcss" module>
    @reference "tailwindcss";

    .SSR-grad {
        background: linear-gradient(to bottom, var(--color-yellow-400), var(--color-pink-400));
    }

    .SR-grad {
        background: linear-gradient(to bottom, var(--color-purple-300), var(--color-purple-800));
    }
</style>
