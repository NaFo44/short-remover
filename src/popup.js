const api = globalThis.browser ?? globalThis.chrome;
const storage = api.storage.sync;

const toggle = document.querySelector('#toggle');
const sidebarToggle = document.querySelector('#sidebar-toggle');

const defaultSettings = {
  removeYtShorts: true,
  removeSidebarShorts: false,
}

function render(settings) {
  toggle.checked = settings.removeYtShorts;
  toggle.setAttribute(
    'aria-label',
    settings.removeYtShorts ? 'Disable Shorts removal' : 'Enable Shorts removal'
  );

  sidebarToggle.checked = settings.removeSidebarShorts;
}

(async () => {
  const settings = await storage.get(defaultSettings);

  render(settings);

  toggle.addEventListener('change', async () => {
    await storage.set({
      removeYtShorts: toggle.checked,
    });
  });

  sidebarToggle.addEventListener('change', async () => {
    await storage.set({
      removeSidebarShorts: sidebarToggle.checked,
    });
  });
})();
