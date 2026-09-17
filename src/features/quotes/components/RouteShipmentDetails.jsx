// features/quotes/components/RouteShipmentDetails.jsx
import Input from '../../../components/ui/Input/Input';
import Textarea from '../../../components/ui/Textarea/Textarea';
import Select from '../../../components/ui/Select/Select';
import SectionTitle from '../../../components/patterns/SectionTitle';
import ShipmentModeSelector from './ShipmentModeSelector';

export default function RouteShipmentDetails({ form, updateField, setShipmentMode }) {
  const set = (field) => (e) => updateField('route', field, e.target.value);

  return (
    <div className="qb-card qb-card--route">
      <SectionTitle number={3}>Route &amp; Shipment Details</SectionTitle>

      <div className="qb-split-row" style={{ marginBottom: 22 }}>
        <div>
          <h3 className="qb-subheading">Origin Details</h3>
          <div className="qb-field"><Textarea label="Factory / Pickup Address" value={form.pickupAddress} onChange={set('pickupAddress')} /></div>
          <div className="qb-field"><Input label="Pickup Location" value={form.pickupLocation} onChange={set('pickupLocation')} /></div>
          <div className="qb-field">
            <Select label="Origin Port" value={form.originPort} onChange={set('originPort')}
              options={[{ label: 'Nhava Sheva (JNPT), India' }, { label: 'Mundra Port, India' }, { label: 'Chennai Port, India' }]} />
          </div>
        </div>
        <div>
          <h3 className="qb-subheading">Destination Details</h3>
          <div className="qb-field"><Input label="Destination Port" value={form.destinationPort} onChange={set('destinationPort')} /></div>
          <div className="qb-field"><Textarea label="Final Delivery Address" value={form.deliveryAddress} onChange={set('deliveryAddress')} /></div>
        </div>
      </div>

      <h3 className="qb-subheading">Shipment Mode</h3>
      <ShipmentModeSelector value={form.shipmentMode} onChange={setShipmentMode} />

      <h3 className="qb-subheading">Schedule</h3>
      <div className="qb-two-col">
        <div className="qb-field"><Input label="Pickup Date" type="date" value={form.pickupDate} onChange={set('pickupDate')} /></div>
        <div className="qb-field"><Input label="ETA (Estimated)" type="date" value={form.eta} onChange={set('eta')} /></div>
        <div className="qb-field"><Input label="Delivery Date" type="date" value={form.deliveryDate} onChange={set('deliveryDate')} /></div>
        <div className="qb-field"><Input label="Delivery (Estimated)" type="date" value={form.deliveryEstimated} onChange={set('deliveryEstimated')} /></div>
      </div>
    </div>
  );
}
