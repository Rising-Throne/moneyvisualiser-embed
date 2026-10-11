export type Environment = 'gold-vault' | 'warehouse' | 'aircraft-carrier' | 'football-field' | 'parking-lot' | 'minimal-grid';
export type Surface = 'auto' | 'pedestal' | 'small-table' | 'tower' | 'pallet' | 'trolley' | 'ground';
export type Camera = 'normal' | 'overhead' | 'side-left' | 'side-right' | 'diagonal' | 'money-close';
export type Theme = 'dark' | 'light';
export type Renderer = 'auto' | 'webgl';
export type Loader = 'default' | 'none' | 'portal' | 'warp' | 'shutters' | 'blueprint' | 'gold-dust' | 'cinema';
export type Tool =
  | 'what-does-x-look-like'
  | 'cash-stack-calculator'
  | 'denomination-mix-optimizer'
  | 'carryability-planner'
  | 'value-density-index';

export interface EmbedOptions {
  /** Amount to show, in the `from` currency. Default 1000. */
  amount?: number;
  /** ISO 4217 code of one of the 82 supported currencies. Default "USD". */
  from?: string;
  /** Currency to compare with, in compare mode. Default "EUR". */
  to?: string;
  /** One stack, or two side by side. Default "compare". */
  mode?: 'single' | 'compare';
  /** Where the scene takes place. Default "gold-vault". */
  environment?: Environment;
  /** What the money stands on; "auto" picks one to suit the amount. Default "pedestal". */
  surface?: Surface;
  /** Starting camera angle. Default "normal". */
  camera?: Camera;
  /** Start close to the money; overrides `camera` and hides labels. Default false. */
  closeUp?: boolean;
  /** Value labels on the stacks. Default true. */
  labels?: boolean;
  /** Amount badges along the top edge of the frame. Default true. */
  amounts?: boolean;
  /** A measuring ruler beside the stacks; compare mode on the tower surface only. Default false. */
  ruler?: boolean;
  /** A 1.75 m person silhouette beside the money, for scale. Default false. */
  person?: boolean;
  /** Colour of the frame's badges, stats panel and credit. Default "dark". */
  theme?: Theme;
  /** Note count, weight and height of the stack. Default false. */
  stats?: boolean;
  /** "auto" uses WebGPU where available, "webgl" forces WebGL. Default "auto". */
  renderer?: Renderer;
  /** What covers the frame while the scene loads; "none" shows nothing. Default "default" (the pulsing logo). */
  loader?: Loader;
}

export interface FixedFrame {
  width?: number | string;
  height?: number;
  title?: string;
}

export interface ResponsiveFrame {
  /** CSS aspect ratio, such as "16 / 9". Default "16 / 9". */
  aspectRatio?: string;
  title?: string;
}

export interface ScriptFrame {
  /** CSS aspect ratio, such as "4 / 3". The script defaults to 16 / 9. */
  aspectRatio?: string;
  /** Maximum width in pixels, or "none" to fill the column. The script defaults to 800. */
  maxWidth?: number | 'none';
}

export const ORIGIN: string;
export const RENDER_PATH: string;
export const SCRIPT_URL: string;
export const CURRENCIES: Readonly<Record<string, string>>;
export const ENVIRONMENTS: readonly Environment[];
export const SURFACES: readonly Surface[];
export const CAMERAS: readonly Camera[];
export const THEMES: readonly Theme[];
export const RENDERERS: readonly Renderer[];
export const LOADERS: readonly Loader[];
export const DEFAULTS: Readonly<Required<EmbedOptions>>;
export const SIZES: Readonly<Record<'small' | 'medium' | 'large' | 'responsive', { width: number | string; height: number }>>;
export const ASPECT_RATIOS: readonly string[];
export const TOOLS: Readonly<Record<Tool, string>>;

export function embedUrl(options?: EmbedOptions): string;
export function embedTitle(options?: EmbedOptions): string;
export function embedCode(options?: EmbedOptions, frame?: FixedFrame): string;
export function responsiveEmbedCode(options?: EmbedOptions, frame?: ResponsiveFrame): string;
export function scriptCode(options?: EmbedOptions, frame?: ScriptFrame): string;
export function toolEmbedCode(tool: Tool): string;
