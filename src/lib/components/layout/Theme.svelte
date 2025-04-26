<script lang="ts">
    import { onMount } from "svelte";

    let dark: boolean;
    let hidden: boolean;

    onMount(() => {
        dark = document.documentElement.dataset.theme === "dark";

        hidden = false;

        const matcher = window.matchMedia("(prefers-color-scheme: dark)");
        matcher.addEventListener("change", handleChange);
    });

    function handleChange({ matches: dark }: MediaQueryListEvent) {
        if (!localStorage.getItem("theme")) {
            setMode(dark);
        }
    }

    function toggle() {
        setMode(!dark);
    }

    function setMode(value: boolean) {
        dark = value;
        value
            ? (document.documentElement.dataset.theme = "dark")
            : (document.documentElement.dataset.theme = "light");

        localStorage.setItem("theme", value ? "dark" : "light");

        if (window.matchMedia(`(prefers-color-scheme: ${localStorage.getItem("theme")})`).matches) {
            localStorage.removeItem("theme");
        }
    }
</script>

<svelte:head>
    <script>
        if (
            localStorage.getItem("theme") === "dark" ||
            (!localStorage.getItem("theme") &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.dataset.theme = "dark";
        } else {
            document.documentElement.dataset.theme = "light";
        }
    </script>
</svelte:head>

<button
    class="text-base-content m-4 hidden cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
    class:hidden
    on:click={toggle}
    aria-label="Toggle theme"
    ><svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-sun-moon"
        ><path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"></path><path d="M12 2v2"></path><path
            d="M12 20v2"
        ></path><path d="m4.9 4.9 1.4 1.4"></path><path d="m17.7 17.7 1.4 1.4"></path><path
            d="M2 12h2"
        ></path><path d="M20 12h2"></path><path d="m6.3 17.7-1.4 1.4"></path><path
            d="m19.1 4.9-1.4 1.4"
        ></path></svg
    >
</button>

<style lang="postcss">
    @reference "tailwindcss";
    :global(body) {
        @apply dark:bg-slate-800;
    }
</style>
