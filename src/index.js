/**
 * Build Money Visualiser embed URLs and iframe snippets.
 *
 * Mirrors exactly what https://moneyvisualiser.com/embed/render reads. Values are
 * checked here because the renderer passes them straight to the 3D scene: an
 * unknown environment or camera does not fall back to a default.
 */

import { CURRENCIES } from './currencies.js';

export { CURRENCIES };

export const ORIGIN = 'https://moneyvisualiser.com';
export const RENDER_PATH = '/embed/render';

export const ENVIRONMENTS = Object.freeze([
  'gold-vault',
  'warehouse',
  'aircraft-carrier',
  'football-field',
  'parking-lot',
  'minimal-grid',
]);
export const SURFACES = Object.freeze(['pedestal', 'pallet', 'trolley', 'ground', 'tower', 'small-table']);
export const CAMERAS = Object.freeze(['normal', 'overhead', 'side-left', 'side-right', 'diagonal', 'money-close']);
export const THEMES = Object.freeze(['dark', 'light']);

/** The renderer's own defaults. Options equal to these are left out of the URL. */
export const DEFAULTS = Object.freeze({
  amount: 1000,
  from: 'USD',
  to: 'EUR',
  mode: 'compare',
  environment: 'gold-vault',
  surface: 'pedestal',
  camera: 'normal',
  closeUp: false,
  labels: true,
  ruler: false,
  theme: 'dark',
  stats: false,
});

/** Sizes offered by the configurator at moneyvisualiser.com/embed. */
export const SIZES = Object.freeze({
  small: { width: 300, height: 250 },
  medium: { width: 480, height: 360 },
  large: { width: 640, height: 480 },
  responsive: { width: '100%', height: 560 },
});

function oneOf(name, value, allowed) {
  if (!allowed.includes(value)) {
    throw new TypeError(`${name} must be one of ${allowed.join(', ')}; got "${value}"`);
  }
}

function currency(name, code) {
  const upper = String(code).toUpperCase();
  if (!Object.prototype.hasOwnProperty.call(CURRENCIES, upper)) {
    throw new TypeError(`${name} must be one of the 82 supported currency codes; got "${code}"`);
  }
  return upper;
}

/**
 * The embed URL for a scene.
 *
 * @param {import('./index.js').EmbedOptions} options
 * @returns {string}
 */
export function embedUrl(options = {}) {
  const o = { ...DEFAULTS, ...options };
  const amount = Number(o.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new TypeError(`amount must be a positive number; got "${o.amount}"`);
  oneOf('mode', o.mode, ['single', 'compare']);
  oneOf('environment', o.environment, ENVIRONMENTS);
  oneOf('surface', o.surface, SURFACES);
  oneOf('camera', o.camera, CAMERAS);
  oneOf('theme', o.theme, THEMES);

  const params = new URLSearchParams();
  params.set('amount', String(amount));
  params.set('from', currency('from', o.from));
  if (o.mode === 'compare') params.set('to', currency('to', o.to));
  else params.set('mode', 'single');
  if (o.environment !== DEFAULTS.environment) params.set('env', o.environment);
  if (o.surface !== DEFAULTS.surface) params.set('surface', o.surface);
  if (o.camera !== DEFAULTS.camera) params.set('camera', o.camera);
  if (o.closeUp) params.set('zoom', 'close');
  if (!o.labels) params.set('showLabels', 'false');
  if (o.ruler) params.set('showRuler', 'true');
  if (o.theme !== DEFAULTS.theme) params.set('theme', o.theme);
  if (o.stats) params.set('stats', 'true');

  return `${ORIGIN}${RENDER_PATH}?${params.toString()}`;
}

const escapeAttr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** A plain-language title for the iframe, read out by screen readers. */
export function embedTitle(options = {}) {
  const o = { ...DEFAULTS, ...options };
  const amount = Number(o.amount).toLocaleString('en-US');
  return o.mode === 'single'
    ? `What ${amount} ${o.from} looks like, in 3D`
    : `${amount} ${o.from} compared with ${o.to}, in 3D`;
}

/**
 * A ready-to-paste iframe snippet.
 *
 * @param {import('./index.js').EmbedOptions} options
 * @param {{ width?: number | string, height?: number, title?: string }} [frame]
 */
export function embedCode(options = {}, frame = {}) {
  const width = frame.width ?? SIZES.large.width;
  const height = frame.height ?? SIZES.large.height;
  const title = frame.title ?? embedTitle(options);
  return [
    '<iframe',
    `  src="${escapeAttr(embedUrl(options))}"`,
    `  width="${escapeAttr(width)}"`,
    `  height="${escapeAttr(height)}"`,
    `  title="${escapeAttr(title)}"`,
    '  loading="lazy"',
    '  style="border: 0; border-radius: 12px;">',
    '</iframe>',
  ].join('\n');
}

/** The five embeddable tools. Each opens in its default state. */
export const TOOLS = Object.freeze({
  'what-does-x-look-like': 'What Does X Look Like?',
  'cash-stack-calculator': 'Cash Stack Calculator',
  'denomination-mix-optimizer': 'Denomination Mix Optimizer',
  'carryability-planner': 'Carryability Planner',
  'value-density-index': 'Value Density Index',
});

/** A ready-to-paste iframe snippet for one of the tools. */
export function toolEmbedCode(tool) {
  oneOf('tool', tool, Object.keys(TOOLS));
  return [
    `<iframe src="${ORIGIN}/tools/${tool}/embed"`,
    '  style="width:100%;height:600px;border:none;border-radius:12px"',
    `  title="${escapeAttr(TOOLS[tool])}" loading="lazy"></iframe>`,
  ].join('\n');
}
