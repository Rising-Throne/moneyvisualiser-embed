export type Environment = 'gold-vault' | 'warehouse' | 'aircraft-carrier' | 'football-field' | 'parking-lot' | 'minimal-grid';
export type Surface = 'pedestal' | 'pallet' | 'trolley' | 'ground' | 'tower' | 'small-table';
export type Camera = 'normal' | 'overhead' | 'side-left' | 'side-right' | 'diagonal' | 'money-close';
export type Theme = 'dark' | 'light';
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
  /** Default "gold-vault". */
  environment?: Environment;
  /** What the money stands on. Default "pedestal". */
  surface?: Surface;
  /** Starting camera angle. Default "normal". */
  camera?: Camera;
  /** Start close to the money; hides labels. Default false. */
  closeUp?: boolean;
  /** Value labels on the stacks. Default true. */
  labels?: boolean;
  /** A measuring ruler beside the stack. Default false. */
  ruler?: boolean;
  /** Background behind the scene. Default "dark". */
  theme?: Theme;
  /** Note count, weight and height of the stack. Default false. */
  stats?: boolean;
}

export const ORIGIN: string;
export const RENDER_PATH: string;
export const CURRENCIES: Readonly<Record<string, string>>;
export const ENVIRONMENTS: readonly Environment[];
export const SURFACES: readonly Surface[];
export const CAMERAS: readonly Camera[];
export const THEMES: readonly Theme[];
export const DEFAULTS: Readonly<Required<EmbedOptions>>;
export const SIZES: Readonly<Record<'small' | 'medium' | 'large' | 'responsive', { width: number | string; height: number }>>;
export const TOOLS: Readonly<Record<Tool, string>>;

export function embedUrl(options?: EmbedOptions): string;
export function embedTitle(options?: EmbedOptions): string;
export function embedCode(options?: EmbedOptions, frame?: { width?: number | string; height?: number; title?: string }): string;
export function toolEmbedCode(tool: Tool): string;
