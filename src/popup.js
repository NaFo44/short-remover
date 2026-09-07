const api = globalThis.browser ?? globalThis.chrome;
const toggle = document.querySelector('#toggle');
const storage = api.storage.sync;
const storageKey = 'removeYtShorts';
const defaultEnabled = true;

function render(enabled) {
  toggle.checked = enabled;
  toggle.setAttribute(
    'aria-label',
    enabled ? 'Disable Shorts removal' : 'Enable Shorts removal'
  );
}

(async () => {
  const settings = await storage.get({ [storageKey]: defaultEnabled });

  render(settings[storageKey]);

  toggle.addEventListener('change', async () => {
    await storage.set({ [storageKey]: toggle.checked });
  });
})();
