// components/patterns/StatRow.jsx
// A "label ⟷ value" row, used by the House Jobs Master Job Summary panel
// and the Quotes Cost Builder margin/selling-price rows.

export default function StatRow({ label, value, valueClassName = 'fw-bold', bordered = true }) {
  return (
    <li className={`list-group-item d-flex justify-content-between px-0 ${bordered ? '' : 'border-bottom-0'}`}>
      <span className="text-muted">{label}</span>
      <span className={valueClassName}>{value}</span>
    </li>
  );
}
