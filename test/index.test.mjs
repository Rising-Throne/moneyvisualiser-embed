import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CURRENCIES,
  DEFAULTS,
  SURFACES,
  embedCode,
  embedUrl,
  responsiveEmbedCode,
  scriptCode,
  toolEmbedCode,
} from '../src/index.js';

const params = (url) => Object.fromEntries(new URL(url).searchParams);
const attrs = (snippet) => Object.fromEntries([...snippet.matchAll(/(data-[a-z-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));

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
      surface: 'auto',
      camera: 'diagonal',
      labels: false,
      amounts: false,
      ruler: true,
      person: true,
      theme: 'light',
      stats: true,
      renderer: 'webgl',
      loader: 'gold-dust',
    }),
  );
  assert.deepEqual(p, {
    amount: '50000',
    from: 'GBP',
    to: 'JPY',
    env: 'parking-lot',
    surface: 'auto',
    camera: 'diagonal',
    showLabels: 'false',
    showAmounts: 'false',
    showRuler: 'true',
    showPerson: 'true',
    stats: 'true',
    theme: 'light',
    webgl: 'true',
    loader: 'gold-dust',
  });
});

test('closeUp replaces the camera and the labels setting, as the renderer does', () => {
  assert.deepEqual(params(embedUrl({ closeUp: true, camera: 'overhead', labels: false })), {
    amount: '1000',
    from: 'USD',
    to: 'EUR',
    zoom: 'close',
  });
});

test('the ruler is left out where the scene would not draw it', () => {
  assert.equal(params(embedUrl({ mode: 'single', surface: 'tower', ruler: true })).showRuler, undefined);
});

test('every surface the app offers is accepted, including auto', () => {
  for (const surface of SURFACES) assert.doesNotThrow(() => embedUrl({ surface }));
  assert.equal(SURFACES.length, 7);
});

test('unknown values are rejected instead of reaching the renderer', () => {
  assert.throws(() => embedUrl({ environment: 'gold' }), /environment must be one of/);
  assert.throws(() => embedUrl({ camera: 'freeview' }), /camera must be one of/);
  assert.throws(() => embedUrl({ renderer: 'webgpu' }), /renderer must be one of/);
  assert.throws(() => embedUrl({ loader: 'spinner' }), /loader must be one of/);
  assert.throws(() => embedUrl({ from: 'XYZ' }), /82 supported currency codes/);
  assert.throws(() => embedUrl({ amount: -5 }), /positive number/);
});

test('snippets escape attributes and carry a title', () => {
  const code = embedCode({ amount: 1e9, mode: 'single' }, { width: '100%', height: 560 });
  assert.match(code, /src="https:\/\/moneyvisualiser\.com\/embed\/render\?amount=1000000000&amp;from=USD&amp;mode=single"/);
  assert.match(code, /title="What 1,000,000,000 USD looks like, in 3D"/);
  assert.match(code, /loading="lazy"/);
});

test('responsive snippets keep their aspect ratio', () => {
  const code = responsiveEmbedCode({ amount: 1e6, mode: 'single' }, { aspectRatio: '4 / 3' });
  assert.match(code, /aspect-ratio: 4 \/ 3/);
  assert.match(code, /inset: 0; width: 100%; height: 100%/);
  assert.match(responsiveEmbedCode(), /aspect-ratio: 16 \/ 9/);
  assert.throws(() => responsiveEmbedCode({}, { aspectRatio: 'wide' }), /aspectRatio/);
});

test('the script snippet only writes what differs from the script defaults', () => {
  assert.deepEqual(attrs(scriptCode({ amount: 250000, from: 'GBP' })), {
    'data-amount': '250000',
    'data-currency': 'GBP',
  });
  assert.deepEqual(
    attrs(
      scriptCode(
        { amount: 5e4, from: 'EUR', to: 'JPY', mode: 'compare', environment: 'warehouse', surface: 'auto', labels: true, person: true, stats: false, theme: 'light', loader: 'none' },
        { aspectRatio: '4 / 3', maxWidth: 'none' },
      ),
    ),
    {
      'data-amount': '50000',
      'data-currency': 'EUR',
      'data-mode': 'compare',
      'data-to': 'JPY',
      'data-env': 'warehouse',
      'data-surface': 'auto',
      'data-show-labels': 'true',
      'data-show-person': 'true',
      'data-show-stats': 'false',
      'data-theme': 'light',
      'data-loader': 'none',
      'data-aspect-ratio': '4/3',
      'data-max-width': 'none',
    },
  );
  assert.match(scriptCode(), /src="https:\/\/moneyvisualiser\.com\/embed\.js"/);
  assert.throws(() => scriptCode({}, { maxWidth: 'wide' }), /maxWidth/);
});

test('defaults cover every option', () => {
  assert.deepEqual(Object.keys(DEFAULTS).sort(), [
    'amount',
    'amounts',
    'camera',
    'closeUp',
    'environment',
    'from',
    'labels',
    'loader',
    'mode',
    'person',
    'renderer',
    'ruler',
    'stats',
    'surface',
    'theme',
    'to',
  ]);
});

test('tool snippets point at the tool embed routes', () => {
  assert.match(toolEmbedCode('cash-stack-calculator'), /\/tools\/cash-stack-calculator\/embed/);
  assert.throws(() => toolEmbedCode('nope'), /tool must be one of/);
});

test('82 currencies', () => assert.equal(Object.keys(CURRENCIES).length, 82));
