/**
 * Flat, geometric up-right arrow used for knobs and row affordances.
 * Replaces the system `↗` glyph, which rendered inconsistently across
 * platforms and read as cheap. Drawn in `currentColor` so it follows the
 * surrounding chrome / theme the same way text does.
 */
export default function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6.5 17.5 17.5 6.5" />
      <path d="M8 6.5h9.5V16" />
    </svg>
  );
}