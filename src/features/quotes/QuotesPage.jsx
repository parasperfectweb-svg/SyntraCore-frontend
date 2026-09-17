// features/quotes/QuotesPage.jsx
import './Quotes.css';
import Button from '../../components/ui/Button/Button';
import PartiesInformation from './components/PartiesInformation';
import CargoInformation from './components/CargoInformation';
import RouteShipmentDetails from './components/RouteShipmentDetails';
import CommercialIncoterm from './components/CommercialIncoterm';
import CostBuilder from './components/CostBuilder/CostBuilder';
import { useQuoteForm } from './hooks/useQuoteForm';
import { saveDraftQuote } from './api/quotesApi';

export default function QuotesPage() {
  const { form, updateField, setShipmentMode, setContainerType } = useQuoteForm();

  return (
    <div className="qb-main">
      <div className="qb-page-header">
        <div>
          <h1>New Quote</h1>
          <p className="text-muted">Fill in shipment details to generate a freight quote.</p>
        </div>
        <div className="qb-header-actions">
          <Button variant="secondary" className="qb-btn qb-btn--ghost" onClick={() => saveDraftQuote(form)}>
            Save Draft
          </Button>
          <Button variant="primary" className="qb-btn qb-btn--filled">Preview Quote</Button>
        </div>
      </div>

      <PartiesInformation form={form.parties} updateField={updateField} />

      <div className="qb-pair-grid">
        <CargoInformation form={form.cargo} updateField={updateField} setContainerType={setContainerType} />
        <RouteShipmentDetails form={form.route} updateField={updateField} setShipmentMode={setShipmentMode} />
      </div>

      <CommercialIncoterm form={form.commercial} updateField={updateField} />

      <CostBuilder formState={form} />
    </div>
  );
}
