function attachHandlers(root = document) {
  const btn = root.getElementById('changeBtn');
  if (!btn) return;
  btn.addEventListener('click', function() {
    const h = root.getElementById('greeting');
    if (!h) return;
    h.textContent = h.textContent === 'Hello, world!' ? 'Hello from feature branch!' : 'Hello, world!';
  });
}

// Auto-run in browser environments
if (typeof window !== 'undefined') {
  attachHandlers();
}

// Export for tests (CommonJS)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { attachHandlers };
}
