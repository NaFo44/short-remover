(async () => {
    const storage =
    typeof browser !== 'undefined'
        ? browser.storage.local
        : chrome.storage.sync;
        
    const { removeYtShorts = true } = await storage.get({ removeYtShorts: true });

    const api = globalThis.browser ?? globalThis.chrome;

    api.storage.onChanged.addListener((changes, areaName) => {
        if (
            (areaName === 'local' || areaName === 'sync') &&
            'removeYtShorts' in changes
        ) {
            location.reload();
        }
    });

    if (removeYtShorts && location.host.includes('youtube.com')) {
        const removeYtShorts = () => {
            document.querySelectorAll('ytd-reel-shelf-renderer, ytd-rich-shelf-renderer[is-shorts]')
                .forEach(el => el.remove());
        };

        if (location.pathname.includes('/shorts')) {
            const pathArray = location.pathname.split('/');
            const videoId = pathArray[pathArray.indexOf('shorts') + 1];
            location.replace(
                videoId ? `${location.protocol}//${location.host}//watch?v=${videoId}`
                : `${location.protocol}//${location.host}`
            )
        }

        new MutationObserver(removeYtShorts).observe(document.body, {
            childList: true,
            subtree: true,
        });

        removeYtShorts();
    }
})();