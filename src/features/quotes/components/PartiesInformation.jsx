// features/quotes/components/PartiesInformation.jsx
import Input from '../../../components/ui/Input/Input';
import Textarea from '../../../components/ui/Textarea/Textarea';
import SectionTitle from '../../../components/patterns/SectionTitle';

export default function PartiesInformation({ form, updateField }) {
  const set = (field) => (e) => updateField('parties', field, e.target.value);

  return (
    <div className="qb-card qb-card--parties">
      <SectionTitle number={1}>Parties Information</SectionTitle>

      <div className="qb-split-row">
        <div>
          <h3 className="qb-subheading">
            <span className="qb-dot" />
            Exporter Details
          </h3>
          <div className="qb-field"><Input label="Company Name" value={form.exporterCompany} onChange={set('exporterCompany')} /></div>
          <div className="qb-field"><Input label="Contact Person" value={form.exporterContact} onChange={set('exporterContact')} /></div>
          <div className="qb-field"><Input label="Email" type="email" value={form.exporterEmail} onChange={set('exporterEmail')} /></div>
          <div className="qb-field"><Input label="Phone" value={form.exporterPhone} onChange={set('exporterPhone')} /></div>
          <div className="qb-field"><Textarea label="Address" value={form.exporterAddress} onChange={set('exporterAddress')} /></div>
        </div>
        <div>
          <h3 className="qb-subheading" style={{ color: '#16a34a' }}>
            <span className="qb-dot" />
            Importer Details
          </h3>
          <div className="qb-field"><Input label="Company Name" value={form.importerCompany} onChange={set('importerCompany')} /></div>
          <div className="qb-field"><Input label="Contact Person" value={form.importerContact} onChange={set('importerContact')} /></div>
          <div className="qb-field"><Input label="Email" type="email" value={form.importerEmail} onChange={set('importerEmail')} /></div>
          <div className="qb-field"><Input label="Phone" value={form.importerPhone} onChange={set('importerPhone')} /></div>
          <div className="qb-field"><Textarea label="Address" value={form.importerAddress} onChange={set('importerAddress')} /></div>
        </div>
      </div>

      <div className="qb-split-row qb-split-row--triple">
        <div>
          <h3 className="qb-subheading">Shipper Details</h3>
          <div className="qb-field"><Input label="Company Name" value={form.shipperCompany} onChange={set('shipperCompany')} /></div>
          <div className="qb-field"><Input label="Contact" value={form.shipperContact} onChange={set('shipperContact')} /></div>
          <div className="qb-field"><Textarea label="Address" value={form.shipperAddress} onChange={set('shipperAddress')} /></div>
        </div>
        <div>
          <h3 className="qb-subheading">Consignee Details</h3>
          <div className="qb-field"><Input label="Company Name" value={form.consigneeCompany} onChange={set('consigneeCompany')} /></div>
          <div className="qb-field"><Input label="Contact" value={form.consigneeContact} onChange={set('consigneeContact')} /></div>
          <div className="qb-field"><Textarea label="Address" value={form.consigneeAddress} onChange={set('consigneeAddress')} /></div>
        </div>
        <div>
          <h3 className="qb-subheading">Notify Party <span className="optional">(Optional)</span></h3>
          <div className="qb-field"><Input label="Company Name" value={form.notifyCompany} onChange={set('notifyCompany')} /></div>
          <div className="qb-field"><Input label="Contact" value={form.notifyContact} onChange={set('notifyContact')} /></div>
          <div className="qb-field"><Textarea label="Address" value={form.notifyAddress} onChange={set('notifyAddress')} /></div>
        </div>
      </div>
    </div>
  );
}
