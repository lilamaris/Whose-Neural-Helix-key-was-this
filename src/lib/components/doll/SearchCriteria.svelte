<script lang="ts">
    import { translations } from "$lib/utils/i18n";
    import { locale } from "$stores/localeStore";
    import { searchTerm, criteria, sortOrder, country } from "$stores/searchStore";

    $: labels = translations[$locale];
</script>

<div class="mb-2 flex">
    <select
        bind:value={$criteria}
        class="bg-base-200 text-base-content border-base-300 mr-[1px] rounded-l-md border-1"
    >
        <option value="rare">등급</option>
        <option value="name">이름</option>
        <option value="attack">공격력</option>
    </select>

    <button
        class=" btn bg-base-200 text-base-content border-base-300 rounded-r-md border-1 p-2"
        on:click={() => sortOrder.update((v) => !v)}
        aria-label="정렬 방향 바꾸기"
    >
        {#if $sortOrder}
            ▲ 오름차순
        {:else}
            ▼ 내림차순
        {/if}
    </button>

    <div class="ml-2 flex flex-1 justify-evenly">
        {#each ["cn", "ko"] as c}
            <label for={c} class="flex flex-col items-center lg:flex-row">
                <input id={c} type="checkbox" value={c} bind:group={$country} />
                <span class="text-base-content ml-1">
                    {labels[c] ?? ""}
                </span>
            </label>
        {/each}
    </div>
</div>

<input
    type="text"
    bind:value={$searchTerm}
    placeholder="인형 이름 또는 공용키 검색 (초성 가능)"
    class="w-full rounded-md border p-2 text-black"
/>

<style lang="postcss">
    @reference "tailwindcss";

    input,
    select {
        background-color: var(--color-base-200);
        border-color: var(--color-base-300);
        color: var(--color-base-content);
    }

    input[type="checkbox"]:checked {
        background-color: var(--color-accent);
        border-color: var(--color-accent);
    }

    input:focus,
    select:focus,
    button:focus {
        @apply border-none ring-0 outline-1 outline-offset-1;
        outline-color: var(--color-accent);
    }
</style>
