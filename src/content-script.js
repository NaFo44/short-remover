const api = globalThis.browser ?? globalThis.chrome;
const storage = api.storage.sync;
const storageKey = 'removeYtShorts';
const defaultEnabled = true;
const enabledAttribute = 'data-remove-youtube-shorts';

const shortsStyle = document.createElement('style');
shortsStyle.textContent = `
  html[data-remove-youtube-shorts] ytd-reel-shelf-renderer,
  html[data-remove-youtube-shorts] ytd-rich-shelf-renderer[is-shorts] {
    display: none !important;
  }

  html[data-remove-youtube-sidebar]
    ytd-guide-entry-renderer > a#endpoint[title="Shorts"],
  html[data-remove-youtube-sidebar]
    ytd-guide-entry-renderer > a#endpoint[href^="/shorts"] {
    display: none !important;
  }
`;
document.documentElement.append(shortsStyle);

const sidebarStorageKey = 'removeSidebarShorts';
const sidebarEnabledAttribute = 'data-remove-youtube-sidebar';

let removalEnabled = false;

function redirectShort() {
  if (!removalEnabled || !location.pathname.startsWith('/shorts/')) {
    return;
  }

  const videoId = location.pathname.split('/')[2];
  const destination = videoId
    ? new URL(`/watch?v=${encodeURIComponent(videoId)}`, location.origin)
    : new URL('/', location.origin);

  location.replace(destination.href);
}

function applySidebarSetting(enabled) {
  document.documentElement.toggleAttribute(
    sidebarEnabledAttribute,
    Boolean(enabled)
  );
}

function applySetting(enabled) {
  removalEnabled = Boolean(enabled);
  document.documentElement.toggleAttribute(
    enabledAttribute,
    removalEnabled
  );
  redirectShort();
}

api.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync') {
    return;
  }

  const removalChange = changes[storageKey];

  if (removalChange) {
    applySetting(removalChange.newValue ?? defaultEnabled);
  }

  const sidebarChange = changes[sidebarStorageKey];

  if (sidebarChange) {
    applySidebarSetting(sidebarChange.newValue ?? false);
  }
});

document.addEventListener('yt-navigate-finish', redirectShort);

(async () => {
  const settings = await storage.get({
    [storageKey]: defaultEnabled,
    [sidebarStorageKey]: false,
  });

  applySetting(settings[storageKey]);
  applySidebarSetting(settings[sidebarStorageKey]);
})();
