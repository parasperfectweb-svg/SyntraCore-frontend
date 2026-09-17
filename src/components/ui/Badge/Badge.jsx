// components/ui/Badge/Badge.jsx
// Covers both Bootstrap's built-in subtle-color badges and the extra
// pastel variants (lavender/mint/yellow/sky-blue) defined once in
// styles/global.css for values Bootstrap's default palette doesn't cover.

const BOOTSTRAP_VARIANTS = new Set([
  'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark',
]);
const CUSTOM_VARIANTS = new Set(['lavender', 'mint', 'yellow', 'skyblue']);

export default function Badge({ variant = 'primary', pill = true, className = '', children }) {
  const shape = pill ? 'rounded-pill' : '';
  let colorClass;
  if (BOOTSTRAP_VARIANTS.has(variant)) {
    colorClass = `bg-${variant}-subtle text-${variant}-emphasis`;
  } else if (CUSTOM_VARIANTS.has(variant)) {
    colorClass = `badge-${variant}`;
  } else {
    colorClass = `bg-${variant}`;
  }

  return <span className={`badge ${shape} ${colorClass} ${className}`.trim()}>{children}</span>;
}
