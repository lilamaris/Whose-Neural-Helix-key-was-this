<script lang="ts">
    import type { Doll } from "$lib/types";

    let { doll, click }: { doll: Doll; click: () => void } = $props();
</script>

<button class="doll-portrait-button group" onclick={click}>
    <img src={`/imgs/${doll.id}/portrait.png`} alt={doll.name} class="doll-portrait" />
    <div class="doll-overlay">
        <h4>{doll.name}</h4>
        <span class="">{doll.role.name}</span>
        <span class="neural-hint">
            {doll.neural_helix.special.common.name ?? "몰라!!"}
        </span>
    </div>
</button>

<style lang="postcss" module>
    @reference "tailwindcss";

    .doll-portrait-button {
        @apply relative aspect-square size-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl border shadow-sm transition-colors duration-150 select-none;
        background-color: var(--color-base-200);
        border-color: var(--color-base-300);
    }

    .doll-portrait {
        @apply object-cover group-hover:blur-sm;
    }

    .doll-overlay {
        @apply absolute inset-0 flex flex-col justify-center bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-50;
    }

    .doll-overlay h4 {
        @apply text-lg font-semibold text-white;
    }

    .doll-overlay span {
        @apply text-xs text-gray-200;
    }

    .doll-overlay .neural-hint {
        @apply text-xs font-bold text-wrap whitespace-pre-line text-rose-400;
    }
</style>
