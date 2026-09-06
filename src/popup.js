const api = globalThis.browser ?? globalThis.chrome;
const toggle = document.querySelector('#toggle');

function render(enabled) {
  toggle.setAttribute('aria-pressed', String(enabled));
  toggle.textContent = enabled
    ? 'Show YouTube Shorts'
    : 'Hide YouTube Shorts';
}

(async () => {
  const { removeYtShorts = true } =
    await api.storage.sync.get({ removeYtShorts: true });

  render(removeYtShorts);

  toggle.addEventListener('click', async () => {
    const enabled = toggle.getAttribute('aria-pressed') !== 'true';

    await api.storage.sync.set({ removeYtShorts: enabled });
    render(enabled);
  });
})();