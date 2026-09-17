// features/quotes/components/CostBuilder/CostComparisonSummary.jsx
const ROWS = [
  ['Total Cost (USD)', '6,370', '5,270'],
  ['Selling Price (USD)', '7,007', '5,797'],
  ['Margin (%)', '10.00%', '10.00%'],
  ['Margin Amount', '637', '527'],
  ['Estimated Transit', '18 Days', '25 Days'],
];

export default function CostComparisonSummary({ onGenerate }) {
  return (
    <div className="qb-summary">
      <h3>Cost Comparison Summary</h3>

      <div className="qb-summary-header">
        <span></span>
        <span className="best">Best Price</span>
        <span className="cheap">Cheapest</span>
      </div>
      {ROWS.map(([label, best, cheapest]) => (
        <div className="qb-summary-row" key={label}>
          <span className="label">{label}</span>
          <span className="best">{best}</span>
          <span className="cheap">{cheapest}</span>
        </div>
      ))}

      <button type="button" className="qb-generate-btn btn btn-primary" onClick={onGenerate}>
        Generate Quote
      </button>
    </div>
  );
}
