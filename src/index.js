/**
 * Build Money Visualiser embed URLs and snippets.
 *
 * Mirrors what https://moneyvisualiser.com/embed/render reads (the renderer's
 * own parser lives in the main app at `src/lib/embedParams.ts`). The renderer
 * quietly replaces values it does not know with their defaults, so a typo
 * gives you the wrong scene rather than an error. This module throws instead,
 * before the mistake reaches your page.
 */

import { CURRENCIES } from './currencies.js';

export { CURRENCIES };

export const ORIGIN = 'https://moneyvisualiser.com';
export const RENDER_PATH = '/embed/render';
export const SCRIPT_URL = `${ORIGIN}/embed.js`;

export const ENVIRONMENTS = Object.freeze([
  'gold-vault',
  'warehouse',
  'aircraft-carrier',
  'football-field',
  'parking-lot',
  'minimal-grid',
]);
/** `auto` picks a pillar, pedestal or tower to suit the amount, like the app's AUTO button. */
export const SURFACES = Object.freeze(['auto', 'pedestal', 'small-table', 'tower', 'pallet', 'trolley', 'ground']);
export const CAMERAS = Object.freeze(['normal', 'overhead', 'side-left', 'side-right', 'diagonal', 'money-close']);
export const THEMES = Object.freeze(['dark', 'light']);
/** `auto` = WebGPU where the browser supports it, falling back to WebGL by itself. */
export const RENDERERS = Object.freeze(['auto', 'webgl']);
/**
 * What covers the frame while the scene loads: the pulsing logo (`default`),
 * nothing (`none`), or one of the animated sequences that reveal the scene.
 */
export const LOADERS = Object.freeze(['default', 'none', 'portal', 'warp', 'shutters', 'blueprint', 'gold-dust', 'cinema']);

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
  amounts: true,
  ruler: false,
  person: false,
  theme: 'dark',
  stats: false,
  renderer: 'auto',
  loader: 'default',
});

/** Fixed sizes offered by the configurator at moneyvisualiser.com/embed. */
export const SIZES = Object.freeze({
  small: { width: 300, height: 250 },
  medium: { width: 480, height: 360 },
  large: { width: 640, height: 480 },
  responsive: { width: '100%', height: 560 },
});

/** Aspect ratios offered for responsive embeds. */
export const ASPECT_RATIOS = Object.freeze(['16 / 9', '4 / 3', '1 / 1', '9 / 16']);

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

function aspectRatio(value) {
  const text = String(value).trim();
  if (!/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/.test(text)) {
    throw new TypeError(`aspectRatio must look like "16 / 9"; got "${value}"`);
  }
  return text;
}

/** Validates options and fills in defaults. */
function resolve(options) {
  const o = { ...DEFAULTS, ...options };
  const amount = Number(o.amount);
  if (!Number.isFinite(amount) || amount <= 0) throw new TypeError(`amount must be a positive number; got "${o.amount}"`);
  oneOf('mode', o.mode, ['single', 'compare']);
  oneOf('environment', o.environment, ENVIRONMENTS);
  oneOf('surface', o.surface, SURFACES);
  oneOf('camera', o.camera, CAMERAS);
  oneOf('theme', o.theme, THEMES);
  oneOf('renderer', o.renderer, RENDERERS);
  oneOf('loader', o.loader, LOADERS);
  return { ...o, amount, from: currency('from', o.from), to: currency('to', o.to) };
}

/**
 * The embed URL for a scene.
 *
 * @param {import('./index.js').EmbedOptions} options
 * @returns {string}
 */
export function embedUrl(options = {}) {
  const o = resolve(options);

  const params = new URLSearchParams();
  params.set('amount', String(o.amount));
  params.set('from', o.from);
  if (o.mode === 'compare') params.set('to', o.to);
  else params.set('mode', 'single');
  if (o.environment !== DEFAULTS.environment) params.set('env', o.environment);
  if (o.surface !== DEFAULTS.surface) params.set('surface', o.surface);
  // zoom=close selects the money close-up camera and hides the labels itself.
  if (o.closeUp) params.set('zoom', 'close');
  else if (o.camera !== DEFAULTS.camera) params.set('camera', o.camera);
  if (!o.labels && !o.closeUp) params.set('showLabels', 'false');
  if (!o.amounts) params.set('showAmounts', 'false');
  // The ruler is only drawn in compare mode (on the tower surface).
  if (o.ruler && o.mode === 'compare') params.set('showRuler', 'true');
  if (o.person) params.set('showPerson', 'true');
  if (o.stats) params.set('stats', 'true');
  if (o.theme !== DEFAULTS.theme) params.set('theme', o.theme);
  if (o.renderer === 'webgl') params.set('webgl', 'true');
  if (o.loader !== DEFAULTS.loader) params.set('loader', o.loader);

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
 * A ready-to-paste iframe snippet with a fixed size.
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

/**
 * A snippet that fills its column at any width and keeps its shape. This is
 * what the configurator's "Responsive" size produces.
 *
 * @param {import('./index.js').EmbedOptions} options
 * @param {{ aspectRatio?: string, title?: string }} [frame]
 */
export function responsiveEmbedCode(options = {}, frame = {}) {
  const ratio = aspectRatio(frame.aspectRatio ?? ASPECT_RATIOS[0]);
  const title = frame.title ?? embedTitle(options);
  return [
    `<div style="position: relative; width: 100%; aspect-ratio: ${ratio}; border-radius: 12px; overflow: hidden;">`,
    '  <iframe',
    `    src="${escapeAttr(embedUrl(options))}"`,
    `    title="${escapeAttr(title)}"`,
    '    loading="lazy"',
    '    style="position: absolute; inset: 0; width: 100%; height: 100%; border: 0;">',
    '  </iframe>',
    '</div>',
  ].join('\n');
}

/**
 * The one-line script snippet (`moneyvisualiser.com/embed.js`). The script has
 * its own defaults for backwards compatibility — one stack on a pallet in the
 * gold vault, labels off, stats on, 16:9 up to 800 px — so only attributes
 * that differ from those are written.
 *
 * @param {import('./index.js').EmbedOptions} options
 * @param {{ aspectRatio?: string, maxWidth?: number | 'none' }} [frame]
 */
export function scriptCode(options = {}, frame = {}) {
  // The script's defaults differ from the renderer's: single mode, pallet, no labels, stats on.
  const o = resolve({ mode: 'single', surface: 'pallet', labels: false, stats: true, ...options });
  const attrs = [
    ['data-amount', String(o.amount)],
    ['data-currency', o.from],
  ];
  if (o.mode === 'compare') attrs.push(['data-mode', 'compare'], ['data-to', o.to]);
  if (o.environment !== 'gold-vault') attrs.push(['data-env', o.environment]);
  if (o.surface !== 'pallet') attrs.push(['data-surface', o.surface]);
  if (o.closeUp) attrs.push(['data-zoom', 'close']);
  else if (o.camera !== 'normal') attrs.push(['data-camera', o.camera]);
  if (o.labels && !o.closeUp) attrs.push(['data-show-labels', 'true']);
  if (!o.amounts) attrs.push(['data-show-amounts', 'false']);
  if (o.ruler && o.mode === 'compare') attrs.push(['data-show-ruler', 'true']);
  if (o.person) attrs.push(['data-show-person', 'true']);
  if (!o.stats) attrs.push(['data-show-stats', 'false']);
  if (o.theme === 'light') attrs.push(['data-theme', 'light']);
  if (o.renderer === 'webgl') attrs.push(['data-renderer', 'webgl']);
  if (o.loader !== 'default') attrs.push(['data-loader', o.loader]);
  if (frame.aspectRatio !== undefined) {
    attrs.push(['data-aspect-ratio', aspectRatio(frame.aspectRatio).replace(/\s+/g, '')]);
  }
  if (frame.maxWidth !== undefined) {
    const maxWidth = frame.maxWidth === 'none' ? 'none' : Number(frame.maxWidth);
    if (maxWidth !== 'none' && !(Number.isInteger(maxWidth) && maxWidth >= 10)) {
      throw new TypeError(`maxWidth must be a whole number of pixels or "none"; got "${frame.maxWidth}"`);
    }
    attrs.push(['data-max-width', String(maxWidth)]);
  }
  return [
    '<script',
    `  src="${SCRIPT_URL}"`,
    '  data-mv-widget',
    ...attrs.map(([name, value]) => `  ${name}="${escapeAttr(value)}"`),
    '  async></script>',
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
