document.getElementById('changeBtn').addEventListener('click', function() {
  const h = document.getElementById('greeting');
  h.textContent = h.textContent === 'Hello, world!' ? 'Hello from feature branch!' : 'Hello, world!';
});
