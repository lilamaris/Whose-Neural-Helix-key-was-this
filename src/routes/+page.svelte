<script lang="ts">
    import { selectedDoll, recommendCommonKeys, type ExtendedHelixKey } from "$stores/dollStore";
    import { filteredDolls } from "$stores/searchStore";
    import { onMount } from "svelte";
    import { navStore } from "$stores/uiStore.svelte";

    import DollPortraitButton from "$lib/components/doll/DollPortraitButton.svelte";
    import SearchCriteria from "$lib/components/doll/SearchCriteria.svelte";
    import DollSummary from "$lib/components/doll/DollSummary.svelte";
    import DollStatus from "$lib/components/doll/DollStatus.svelte";
    import { SpecialNeuralHelixType, UniqueNeuralHelixType } from "$lib/types";
    import DollHelixList from "$lib/components/doll/DollHelixList.svelte";
    import Collapsible from "$lib/components/Collapsible.svelte";

    let lastWindowWidth: number;
    let lastWindowHeight: number;

    onMount(() => {
        lastWindowWidth = window.innerWidth;
        lastWindowHeight = window.innerHeight;

        window.addEventListener("resize", () => {
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;

            // 실제 화면 크기가 변경된 경우에만 navigation collapse
            if (currentWidth !== lastWindowWidth || currentHeight !== lastWindowHeight) {
                navStore.set(false);
                lastWindowWidth = currentWidth;
                lastWindowHeight = currentHeight;
            }
        });
    });

    const selDollSpecialKeys: ExtendedHelixKey[] = $derived(
        Object.entries($selectedDoll?.neural_helix.special ?? {})
            .map(([keyType, key]) => ({
                ...key,
                owner: $selectedDoll?.id ?? "",
                type: keyType as SpecialNeuralHelixType
            }))
            .filter(
                (key): key is ExtendedHelixKey & { type: SpecialNeuralHelixType } => key !== null
            )
    );

    const selDollUniqueKeys: ExtendedHelixKey[] = $derived(
        Object.entries($selectedDoll?.neural_helix.unique ?? {})
            .map(([keyType, key]) => ({
                ...key,
                owner: $selectedDoll?.id ?? "",
                type: keyType as UniqueNeuralHelixType
            }))
            .filter(
                (key): key is ExtendedHelixKey & { type: UniqueNeuralHelixType } => key !== null
            )
    );
</script>

<div class="relative grid h-full grid-cols-1">
    <!-- Navigation -->
    <nav
        class="bg-base-100 rounded-r-box md:rounded-box fixed inset-y-[4.5rem] z-10 flex h-[calc(100vh-5rem)] w-[22rem] shrink-0 flex-col gap-2 overflow-hidden shadow-sm transition-transform duration-300 md:left-2 md:z-0 md:h-[calc(100vh-5rem)] md:translate-x-0"
        class:translate-x-0={navStore.isNavOpen}
        class:-translate-x-full={!navStore.isNavOpen}
    >
        <h1 class="text-m text-base-content m-4 text-center font-extrabold">
            이 공용키 누구꺼였지?
        </h1>
        <div class="px-4">
            <SearchCriteria />
        </div>
        {#if $filteredDolls.length === 0}
            <div class="mt-10 flex h-full w-[22rem] shrink-0 flex-col items-center justify-start">
                <h1 class="text-m font-bold text-neutral-600">검색 결과가 없습니다.</h1>
            </div>
        {:else}
            <ul class="doll-list">
                {#each $filteredDolls as doll (doll)}
                    <DollPortraitButton
                        {doll}
                        click={() => {
                            navStore.set(false);
                            selectedDoll.set(doll);
                        }}
                    />
                {/each}
            </ul>
        {/if}
    </nav>

    <!-- Navigation Overlay -->
    {#if navStore.isNavOpen}
        <div
            class="fixed inset-0 z-5 bg-black/50 md:hidden"
            on:click={() => navStore.set(false)}
            on:keydown={(e) => {
                if (e.key === "Escape") navStore.set(false);
            }}
            role="button"
            tabindex="0"
            aria-label="Close navigation"
        ></div>
    {/if}

    <!-- Main Content -->
    <div class="m-2 max-w-[75rem] md:ml-[23rem]">
        {#if $selectedDoll == null}
            <div class="flex h-full flex-col items-center justify-center select-none">
                <img
                    class="aspect-square max-h-60 max-w-60"
                    src="pain.webp"
                    alt="nothing here.."
                    draggable="false"
                />
                <h1 class="text-l mt-10 font-bold text-neutral-600">아무것도 없습니다..</h1>
            </div>
        {:else}
            <div class="flex flex-col gap-1">
                <!-- Doll Summary -->
                <DollSummary doll={$selectedDoll} />

                <!-- Doll Status -->
                <Collapsible open={false}>
                    <h4 slot="header" class="text-s text-base-content px-4 font-bold">능력치</h4>
                    <DollStatus doll={$selectedDoll} />
                </Collapsible>

                <!-- Doll Recommend Common Keys -->
                <Collapsible open={false}>
                    <h4 slot="header" class="text-s text-base-content px-4 font-bold">
                        {$selectedDoll.name} 추천 공용키
                    </h4>
                    <DollHelixList keys={$recommendCommonKeys} hideOwner={false} />
                </Collapsible>

                <!-- Doll Special Keys -->
                <Collapsible open={true}>
                    <h4 slot="header" class="text-s text-base-content px-4 font-bold">
                        뉴럴 헬릭스 - 공용키, 확장키, 결합키
                    </h4>
                    <DollHelixList keys={selDollSpecialKeys} />
                </Collapsible>

                <!-- Doll Unique Keys -->
                <Collapsible open={true}>
                    <h4 slot="header" class="text-s text-base-content px-4 font-bold">
                        뉴럴 헬릭스 - 고유키
                    </h4>
                    <DollHelixList keys={selDollUniqueKeys} />
                </Collapsible>
            </div>
        {/if}
    </div>
</div>

<style lang="postcss" module>
    @reference "tailwindcss";

    .doll-list {
        @apply mr-2 grid auto-rows-min grid-cols-3 flex-wrap content-start justify-center gap-1.5 overflow-y-auto pr-2 pb-4 pl-4;
        scrollbar-gutter: stable;
    }

    .doll-list::-webkit-scrollbar {
        width: 6px;
    }

    .doll-list::-webkit-scrollbar-track {
        background: transparent;
    }

    .doll-list::-webkit-scrollbar-thumb {
        background-color: var(--color-base-300);
        border-radius: 3px;
    }
</style>
