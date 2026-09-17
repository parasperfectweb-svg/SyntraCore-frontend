// features/quotes/components/CostBuilder/CostBuilder.jsx
import { useState } from 'react';
import SectionTitle from '../../../../components/patterns/SectionTitle';
import CostOptionCard from './CostOptionCard';
import CostComparisonSummary from './CostComparisonSummary';
import { generateQuote } from '../../api/quotesApi';

const CHEAPEST_CHARGES = [
  ['Ocean Freight', 3200], ['Local Charges (Origin)', 850], ['Local Charges (Destination)', 700],
  ['Documentation', 150], ['Other Charges', 370],
];
const BEST_CHARGES = [
  ['Ocean Freight', 3950], ['Local Charges (Origin)', 950], ['Local Charges (Destination)', 850],
  ['Documentation', 170], ['Other Charges', 450],
];

export default function CostBuilder({ formState }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="qb-card qb-card--cost">
      <SectionTitle number={5}>Cost Builder</SectionTitle>
      <div className="qb-cost-grid">
        <CostOptionCard
          title="Best Price Option" variant="best" transitDays={18}
          charges={BEST_CHARGES} totalCost={6370} margin="10.00" sellingPrice={7007} marginAmount={637}
          selected={selected === 'best'} onSelect={() => setSelected('best')}
          buttonLabel="Select Best Price"
        />
        <CostOptionCard
          title="Cheapest Option" variant="cheapest" transitDays={25}
          charges={CHEAPEST_CHARGES} totalCost={5270} margin="10.00" sellingPrice={5797} marginAmount={527}
          selected={selected === 'cheapest'} onSelect={() => setSelected('cheapest')}
          buttonLabel="Select Cheapest"
        />
        <CostComparisonSummary onGenerate={() => generateQuote(formState)} />
      </div>
    </div>
  );
}
