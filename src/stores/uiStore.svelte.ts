function createNavStore() {
    let isNavOpen = $state(false);

    function set(open: boolean) {
        isNavOpen = open;
    }

    function toggle() {
        isNavOpen = !isNavOpen;
    }

    return {
        get isNavOpen() {
            return isNavOpen;
        },
        set,
        toggle
    };
}

export const navStore = createNavStore();
