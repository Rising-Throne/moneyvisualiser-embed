# Money Visualiser embed kit

Put a live 3D scene of real money on any web page: one stack of notes, or two currencies side by side, in a gold vault, a warehouse or across a football field. Free to embed, including on commercial sites.

<p align="center">
  <img src="docs/preview.webp" alt="A Money Visualiser scene: one million US dollars and its value in euros, stacked on two display stands in the gold vault" width="720" />
</p>

**[Build one with the configurator](https://moneyvisualiser.com/embed)** · [Embed builder in this repo](demo/index.html) · [Examples](examples/)

## Quick start

Paste this where the scene should appear:

```html
<iframe
  src="https://moneyvisualiser.com/embed/render?amount=1000000&from=USD&mode=single"
  width="640"
  height="480"
  title="What 1,000,000 USD looks like, in 3D"
  loading="lazy"
  style="border: 0; border-radius: 12px;">
</iframe>
```

Change the settings in the address to change the scene. Everything you can set is listed below.

## Settings

| Setting | Values | Default | What it does |
| --- | --- | --- | --- |
| `amount` | Any positive number | `1000` | The amount to show, in the `from` currency |
| `from` | A [currency code](#currencies) | `USD` | The currency of the amount |
| `to` | A [currency code](#currencies) | `EUR` | The currency to compare with, in compare mode |
| `mode` | `single`, `compare` | `compare` | One stack, or two side by side |
| `env` | `gold-vault`, `warehouse`, `aircraft-carrier`, `football-field`, `parking-lot`, `minimal-grid` | `gold-vault` | Where the scene takes place |
| `surface` | `pedestal`, `pallet`, `trolley`, `ground`, `tower`, `small-table` | `pedestal` | What the money stands on |
| `camera` | `normal`, `overhead`, `side-left`, `side-right`, `diagonal`, `money-close` | `normal` | The starting camera angle |
| `zoom` | `close` | off | Start close to the money; this also hides the labels |
| `showLabels` | `false` | shown | Hide the value labels on the stacks |
| `showRuler` | `true` | hidden | Show a measuring ruler beside the stack |
| `theme` | `dark`, `light` | `dark` | The background colour of the frame |
| `stats` | `true` | hidden | Show the note count, weight and height of the stack |

Values must match exactly. The renderer doesn't check them, so a typo such as `env=gold` won't give you the gold vault. The [JavaScript helper](#javascript-helper) catches mistakes like that before they reach your page.

Amounts have no upper limit in embeds; the Money Visualiser web app itself stops at $128 billion for a single stack.

### Examples

```text
Two currencies, from a diagonal angle
https://moneyvisualiser.com/embed/render?amount=50000&from=EUR&to=JPY&camera=diagonal

A billion dollars on a football field, with stats
https://moneyvisualiser.com/embed/render?amount=1000000000&from=USD&mode=single&env=football-field&surface=ground&stats=true

```

## Sizes

The configurator offers these sizes, and custom sizes from 200 × 200 pixels.

| Size | Width × height |
| --- | --- |
| Small | 300 × 250 |
| Medium | 480 × 360 |
| Large | 640 × 480 |
| Responsive | 100% × 560 |

To fill a column at any width and keep the shape, wrap the frame:

```html
<div style="width: 100%; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden;">
  <iframe src="https://moneyvisualiser.com/embed/render?amount=1000000&from=USD&mode=single"
    title="What 1,000,000 USD looks like, in 3D" loading="lazy"
    style="display: block; width: 100%; height: 100%; border: 0;"></iframe>
</div>
```

## The one-line script

If you only need a single stack, the official script builds the frame for you:

```html
<script src="https://moneyvisualiser.com/embed.js" data-mv-widget data-amount="250000" data-currency="GBP" async></script>
```

| Attribute | Values | Default |
| --- | --- | --- |
| `data-amount` | Any positive number | `1000000` |
| `data-currency` | A [currency code](#currencies) | `USD` |
| `data-zoom` | `normal`, `close` | `normal` |
| `data-show-stats` | `true`, `false` | `true` |

The script always draws one stack on a pallet in the gold vault, with labels off, at 16:9 up to 800 pixels wide. For any other scene, use an iframe.

## Tools

Five Money Visualiser tools can also be embedded. Each opens in its default state, and readers enter their own figures inside it.

| Tool | Embed address |
| --- | --- |
| What Does X Look Like? | `https://moneyvisualiser.com/tools/what-does-x-look-like/embed` |
| Cash Stack Calculator | `https://moneyvisualiser.com/tools/cash-stack-calculator/embed` |
| Denomination Mix Optimizer | `https://moneyvisualiser.com/tools/denomination-mix-optimizer/embed` |
| Carryability Planner | `https://moneyvisualiser.com/tools/carryability-planner/embed` |
| Value Density Index | `https://moneyvisualiser.com/tools/value-density-index/embed` |

```html
<iframe src="https://moneyvisualiser.com/tools/cash-stack-calculator/embed"
  style="width:100%;height:600px;border:none;border-radius:12px"
  title="Cash Stack Calculator" loading="lazy"></iframe>
```

## JavaScript helper

A small, dependency-free module that builds embed addresses and snippets, and rejects values the renderer would not understand.

```bash
npm install github:Rising-Throne/moneyvisualiser-embed
```

```js
import { embedCode, embedUrl } from 'moneyvisualiser-embed';

embedUrl({ amount: 1_000_000, from: 'USD', mode: 'single', environment: 'warehouse', stats: true });
// https://moneyvisualiser.com/embed/render?amount=1000000&from=USD&mode=single&env=warehouse&stats=true

embedCode({ amount: 50_000, from: 'EUR', to: 'JPY' }, { width: '100%', height: 560 });
// <iframe src="…" width="100%" height="560" title="50,000 EUR compared with JPY, in 3D" …>

embedUrl({ environment: 'gold' });
// TypeError: environment must be one of gold-vault, warehouse, aircraft-carrier, …
```

The options use readable names (`environment`, `closeUp`, `labels`, `ruler`); TypeScript types are included. A React component is in [`examples/react`](examples/react/MoneyVisualiserEmbed.tsx).

## Currencies

Embeds support 82 currencies.

<details>
<summary>Show all currency codes</summary>

AED, AFN, ALL, AMD, ARS, AUD, AZN, BDT, BHD, BOB, BRL, BYN, CAD, CHF, CLP, CNY, COP, CUP, CZK, DKK, DZD, EGP, ETB, EUR, GBP, GEL, GHS, HKD, HUF, IDR, ILS, INR, IQD, ISK, JOD, JPY, KES, KRW, KWD, KZT, LKR, LYD, MAD, MDL, MKD, MMK, MNT, MXN, MYR, NGN, NOK, NZD, OMR, PEN, PHP, PKR, PLN, PYG, QAR, RON, RSD, RUB, SAR, SDG, SEK, SGD, SOS, THB, TJS, TND, TRY, TWD, TZS, UAH, USD, UYU, UZS, VEF, VND, XAF, XOF, ZAR

Names for each code are in [`src/currencies.js`](src/currencies.js).

</details>

## What runs inside the embed

- **No ads, no cookie banner, no consent prompt and no analytics.** None of them load inside the frame.
- **Live exchange rates**, fetched from Money Visualiser when the scene opens.
- **WebGL**, which every current desktop and mobile browser supports.
- **A small "Powered by" credit** in the corner, linking to moneyvisualiser.com.
- The embed's interface is in English.

## If your site restricts frames

- **Content Security Policy:** allow the embed with `frame-src https://moneyvisualiser.com`.
- **Sandboxed frames:** if you add a `sandbox` attribute, include `allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox`, the same set the official script uses.

## Using the embeds

- Embed them on any site, including commercial ones, at no cost.
- Keep the built-in credit visible: don't cover, crop or hide it.
- Don't present the scene as your own product, or suggest that Money Visualiser endorses your site.

## Troubleshooting

| What you see | Likely cause |
| --- | --- |
| A blank frame | Your site's Content Security Policy blocks it; see above |
| "Refused to connect" | The address points at `moneyvisualiser.com/embed` (the configurator) instead of `/embed/render` |
| The wrong scene | A setting is misspelled; check it against the table, or build the address with the helper |
| An old `/widget/render` address | Still works: it redirects to `/embed/render`, keeping its settings |

## Licence

The code in this repository is MIT licensed ([`LICENSE`](LICENSE)). Money Visualiser itself, including the embedded scenes, belongs to Rising Throne and is not covered by that licence.

Questions or partnerships: [contact@therisingthrone.com](mailto:contact@therisingthrone.com).
