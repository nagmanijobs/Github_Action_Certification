/**
 * @jest-environment jsdom
 */

const { attachHandlers } = require('./script');

beforeEach(() => {
  document.body.innerHTML = `
    <h1 id="greeting">Hello, world!</h1>
    <button id="changeBtn">Change Greeting</button>
  `;
});

test('changes greeting on click to feature message and toggles back', () => {
  attachHandlers(document);
  const btn = document.getElementById('changeBtn');
  const h = document.getElementById('greeting');

  // initial
  expect(h.textContent).toBe('Hello, world!');

  // first click -> feature message
  btn.click();
  expect(h.textContent).toBe('Hello from feature branch!');

  // second click -> back to original
  btn.click();
  expect(h.textContent).toBe('Hello, world!');
});
