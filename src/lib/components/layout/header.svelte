<script lang="ts">
    import Theme from "./Theme.svelte";
    import Icon from "./Icon.svelte";
    import { navStore } from "$stores/uiStore.svelte";
</script>

<header
    class="bg-base-100 fixed z-10 flex h-16 w-full items-center justify-between px-4 shadow-sm select-none"
>
    <div class="flex flex-row items-center gap-2">
        <button
            class="hover:bg-base-300 active:bg-base-100 rounded-selector p-2 focus:outline-none md:hidden"
            aria-label="메뉴 열기"
            on:click={navStore.toggle}
        >
            <Icon class="fill-base-content" width="1.5rem" height="1.5rem" name="menu" />
        </button>
        <a href="/">
            <div class="text-base-content flex h-full flex-row items-center">
                <Icon
                    class="fill-base-content hidden md:block"
                    width="2.5rem"
                    height="2.5rem"
                    name="logo"
                />
                <h1 class="text-base-content text-lg font-semibold">Lilamaris.kr</h1>
            </div>
        </a>
    </div>
    <div class="flex flex-row items-center gap-2">
        <Theme />
        <button
            class="text-base-content m-4 flex cursor-pointer rounded-full border-2 border-transparent text-center transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:outline-none"
            on:click={() =>
                window.open("https://arca.live/b/gilrsfrontline2exili/134616705", "_blank")}
        >
            <Icon
                class=" stroke-base-content fill-none stroke-2"
                width="20"
                height="20"
                name="flag"
            />
            <span class="text-s text-base-content ml-1">원글</span>
        </button>
    </div>
</header>
