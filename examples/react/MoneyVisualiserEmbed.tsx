import { embedTitle, embedUrl, type EmbedOptions } from 'moneyvisualiser-embed';

/**
 * A responsive Money Visualiser scene for React.
 *
 *   <MoneyVisualiserEmbed amount={1_000_000} from="USD" mode="single" environment="warehouse" />
 */
export function MoneyVisualiserEmbed({
  aspectRatio = '16 / 9',
  title,
  ...options
}: EmbedOptions & { aspectRatio?: string; title?: string }) {
  return (
    <div style={{ width: '100%', aspectRatio, borderRadius: 12, overflow: 'hidden', background: '#0b0e11' }}>
      <iframe
        src={embedUrl(options)}
        title={title ?? embedTitle(options)}
        loading="lazy"
        style={{ display: 'block', width: '100%', height: '100%', border: 0 }}
      />
    </div>
  );
}
