// features/quotes/components/CostBuilder/CostOptionCard.jsx
import Button from '../../../../components/ui/Button/Button';

export default function CostOptionCard({
  title, variant, transitDays, charges, totalCost, margin, sellingPrice, marginAmount,
  selected, onSelect, buttonLabel,
}) {
  return (
    <div className={`qb-cost-card qb-cost-card--${variant}`}>
      <div className="qb-cost-card-head">
        <h3>{title}</h3>
        <span className="qb-transit-pill">Est. Transit: {transitDays}d</span>
      </div>

      {charges.map(([label, amount]) => (
        <div className="qb-cost-row" key={label}>
          <span>{label}</span><span>{amount.toLocaleString()}</span>
        </div>
      ))}

      <div className="qb-cost-row total">
        <span>Total Cost</span><span>{totalCost.toLocaleString()}</span>
      </div>

      <div className="qb-margin-row">
        <div><div className="k">Margin</div><div className="v">{margin}%</div></div>
        <div><div className="k">Selling Price</div><div className="v">${sellingPrice.toLocaleString()}</div></div>
        <div><div className="k">Margin Amt.</div><div className="v">${marginAmount.toLocaleString()}</div></div>
      </div>

      <button type="button" className={`qb-select-btn${selected ? ' is-selected' : ''}`} onClick={onSelect}>
        {selected ? 'Selected ✓' : buttonLabel}
      </button>
    </div>
  );
}
