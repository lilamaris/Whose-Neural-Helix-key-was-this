<script lang="ts">
    import "../app.css";
    import Header from "$lib/components/layout/Header.svelte";

    let { children } = $props();
</script>

<svelte:head>
    <title>이 공용키 누구꺼였지?</title>
</svelte:head>

<div
    class="lywrpr bg-base-200 grid min-h-screen grid-rows-[auto_1fr] transition-colors duration-100"
>
    <div class="h-16">
        <Header />
    </div>
    <main class="min-h-[calc(100vh-4rem)]">
        {@render children()}
    </main>
</div>

<style lang="postcss" module>
    @reference "tailwindcss";

    .lywrpr {
        scrollbar-gutter: stable;
    }

    :global(body::-webkit-scrollbar) {
        width: 6px;
    }

    :global(body::-webkit-scrollbar-track) {
        background-color: var(--color-base-200);
    }

    :global(body::-webkit-scrollbar-thumb) {
        background-color: var(--color-base-300);
        border-radius: 3px;
    }
</style>
