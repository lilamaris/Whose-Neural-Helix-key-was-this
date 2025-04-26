<script lang="ts">
    import { createEventDispatcher } from "svelte";
    export let open = true;
    const dispatch = createEventDispatcher<{ toggle: { open: boolean } }>();

    function toggle() {
        open = !open;
        dispatch("toggle", { open });
    }
</script>

<div>
    <!-- header slot: 클릭 영역 -->
    <button
        type="button"
        class="bg-base-100 rounded-box flex w-full cursor-pointer items-center p-4 shadow-sm select-none"
        on:click={toggle}
        on:keydown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
            }
        }}
    >
        <svg
            class="fill-base-content h-5 w-5 transform transition-transform"
            class:rotate-180={open}
            viewBox="0 0 20 20"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 011.08 1.04l-4.25 4.25a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
            />
        </svg>
        <slot name="header" />
    </button>

    <!-- content slot: 접히는 부분 -->
    {#if open}
        <slot />
    {/if}
</div>

<style>
    /* 아이콘 회전 애니메이션은 above Tailwind 클래스에서 처리 */
</style>
