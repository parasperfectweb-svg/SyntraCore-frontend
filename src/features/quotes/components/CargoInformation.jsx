// features/quotes/components/CargoInformation.jsx
import Input from '../../../components/ui/Input/Input';
import Select from '../../../components/ui/Select/Select';
import SectionTitle from '../../../components/patterns/SectionTitle';

const CONTAINER_TYPES = ['20GP', '40GP', '40HC', 'LCL', 'Air Freight'];

export default function CargoInformation({ form, updateField, setContainerType }) {
  const set = (field) => (e) => updateField('cargo', field, e.target.value);

  return (
    <div className="qb-card qb-card--cargo">
      <SectionTitle number={2}>Cargo Information</SectionTitle>

      <div className="qb-split-row" style={{ marginBottom: 22 }}>
        <div>
          <h3 className="qb-subheading">Cargo Details</h3>
          <div className="qb-field">
            <Select label="Commodity" value={form.commodity} onChange={set('commodity')}
              options={[{ label: 'Industrial Machinery Parts' }, { label: 'Textiles' }, { label: 'Electronics' }]} />
          </div>
          <div className="qb-field"><Input label="HS Code" value={form.hsCode} onChange={set('hsCode')} /></div>
          <div className="qb-field">
            <Select label="Cargo Type" value={form.cargoType} onChange={set('cargoType')}
              options={[{ label: 'General' }, { label: 'Perishable' }, { label: 'Fragile' }]} />
          </div>
          <div className="qb-field">
            <Select label="DG / Non-DG" value={form.dgStatus} onChange={set('dgStatus')}
              options={[{ label: 'Non-DG' }, { label: 'DG' }]} />
          </div>
          <div className="qb-field qb-field-currency">
            <label className="form-label small text-muted mb-1">Cargo Value</label>
            <div className="input-group input-group-sm">
              <select className="form-select" value={form.cargoValueCurrency} onChange={set('cargoValueCurrency')}>
                <option>USD</option><option>EUR</option><option>INR</option>
              </select>
              <input className="form-control" value={form.cargoValue} onChange={set('cargoValue')} />
            </div>
          </div>
        </div>
        <div>
          <h3 className="qb-subheading">Packaging Details</h3>
          <div className="qb-field">
            <Select label="Package Type" value={form.packageType} onChange={set('packageType')}
              options={[{ label: 'Cartons' }, { label: 'Pallets' }, { label: 'Crates' }, { label: 'Drums' }]} />
          </div>
          <div className="qb-two-col">
            <div className="qb-field"><Input label="Length" value={form.length} onChange={set('length')} /></div>
            <div className="qb-field"><Input label="Weight" value={form.weight} onChange={set('weight')} /></div>
            <div className="qb-field"><Input label="Height" value={form.height} onChange={set('height')} placeholder="-" /></div>
            <div className="qb-field"><Input label="Packages Count" value={form.packagesCount} onChange={set('packagesCount')} /></div>
          </div>
        </div>
      </div>

      <h3 className="qb-subheading">Measurements</h3>
      <div className="qb-three-col" style={{ marginBottom: 22 }}>
        <div className="qb-field qb-field--suffix">
          <label className="form-label small text-muted mb-1">Total Gross Weight</label>
          <div className="input-group input-group-sm">
            <input className="form-control" value={form.totalGrossWeight} onChange={set('totalGrossWeight')} />
            <span className="input-group-text">KG</span>
          </div>
        </div>
        <div className="qb-field qb-field--suffix">
          <label className="form-label small text-muted mb-1">Total Volume</label>
          <div className="input-group input-group-sm">
            <input className="form-control" value={form.totalVolume} onChange={set('totalVolume')} />
            <span className="input-group-text">CBM</span>
          </div>
        </div>
        <div className="qb-field qb-field--suffix">
          <label className="form-label small text-muted mb-1">Chargeable Weight</label>
          <div className="input-group input-group-sm">
            <input className="form-control" value={form.chargeableWeight} onChange={set('chargeableWeight')} />
            <span className="input-group-text">KG</span>
          </div>
        </div>
      </div>

      <h3 className="qb-subheading">Container / Shipment Type</h3>
      <div className="qb-pill-group">
        {CONTAINER_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            className={`qb-pill${form.containerType === type ? ' is-active' : ''}`}
            onClick={() => setContainerType(type)}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}
