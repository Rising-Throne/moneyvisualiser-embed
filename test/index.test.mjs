import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CURRENCIES, embedCode, embedUrl, toolEmbedCode } from '../src/index.js';

const params = (url) => Object.fromEntries(new URL(url).searchParams);

test('defaults produce the shortest URL the renderer understands', () => {
  assert.equal(embedUrl(), 'https://moneyvisualiser.com/embed/render?amount=1000&from=USD&to=EUR');
});

test('single mode drops the comparison currency', () => {
  assert.deepEqual(params(embedUrl({ amount: 1e6, mode: 'single' })), { amount: '1000000', from: 'USD', mode: 'single' });
});

test('every option maps to the renderer parameter it reads', () => {
  const p = params(
    embedUrl({
      amount: 50000,
      from: 'gbp',
      to: 'JPY',
      environment: 'parking-lot',
      surface: 'pallet',
      camera: 'diagonal',
      closeUp: true,
      labels: false,
      ruler: true,
      theme: 'light',
      stats: true,
    }),
  );
  assert.deepEqual(p, {
    amount: '50000',
    from: 'GBP',
    to: 'JPY',
    env: 'parking-lot',
    surface: 'pallet',
    camera: 'diagonal',
    zoom: 'close',
    showLabels: 'false',
    showRuler: 'true',
    theme: 'light',
    stats: 'true',
  });
});

test('unknown values are rejected instead of reaching the renderer', () => {
  assert.throws(() => embedUrl({ environment: 'gold' }), /environment must be one of/);
  assert.throws(() => embedUrl({ camera: 'freeview' }), /camera must be one of/);
  assert.throws(() => embedUrl({ from: 'XYZ' }), /82 supported currency codes/);
  assert.throws(() => embedUrl({ amount: -5 }), /positive number/);
});

test('snippets escape attributes and carry a title', () => {
  const code = embedCode({ amount: 1e9, mode: 'single' }, { width: '100%', height: 560 });
  assert.match(code, /src="https:\/\/moneyvisualiser\.com\/embed\/render\?amount=1000000000&amp;from=USD&amp;mode=single"/);
  assert.match(code, /title="What 1,000,000,000 USD looks like, in 3D"/);
  assert.match(code, /loading="lazy"/);
});

test('tool snippets point at the tool embed routes', () => {
  assert.match(toolEmbedCode('cash-stack-calculator'), /\/tools\/cash-stack-calculator\/embed/);
  assert.throws(() => toolEmbedCode('nope'), /tool must be one of/);
});

test('82 currencies', () => assert.equal(Object.keys(CURRENCIES).length, 82));
