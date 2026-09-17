// features/quotes/components/CommercialIncoterm.jsx
import Select from '../../../components/ui/Select/Select';
import Input from '../../../components/ui/Input/Input';
import SectionTitle from '../../../components/patterns/SectionTitle';

export default function CommercialIncoterm({ form, updateField }) {
  const set = (field) => (e) => updateField('commercial', field, e.target.value);

  return (
    <div className="qb-card qb-card--commercial mt-4">
      <SectionTitle number={4}>Commercial &amp; Incoterm</SectionTitle>

      <div className="qb-three-col" style={{ marginBottom: 6 }}>
        <div className="qb-field">
          <Select label="Incoterm" value={form.incoterm} onChange={set('incoterm')}
            options={[
              { label: 'FOB – Free On Board' },
              { label: 'CIF – Cost, Insurance & Freight' },
              { label: 'EXW – Ex Works' },
              { label: 'DDP – Delivered Duty Paid' },
            ]} />
          <a href="#" className="qb-incoterm-link">View Incoterm Rules</a>
        </div>
        <div className="qb-field">
          <Select label="Payment Terms" value={form.paymentTerms} onChange={set('paymentTerms')}
            options={[{ label: 'Prepaid' }, { label: 'Collect' }, { label: 'Net 30' }]} />
        </div>
        <div className="qb-field">
          <Select label="Currency" value={form.currency} onChange={set('currency')}
            options={[{ label: 'USD – US Dollar' }, { label: 'EUR – Euro' }, { label: 'INR – Indian Rupee' }]} />
        </div>
        <div className="qb-field">
          <Select label="Insurance" value={form.insurance} onChange={set('insurance')}
            options={[{ label: 'Not Included' }, { label: 'Included' }]} />
        </div>
        <div className="qb-field">
          <Input label="Exchange Rate (if applicable)" value={form.exchangeRate} onChange={set('exchangeRate')} />
        </div>
      </div>
    </div>
  );
}
