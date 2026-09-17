// features/quotes/hooks/useQuoteForm.js
// Owns all state for the multi-section New Quote form. Each section
// (parties, cargo, route, commercial) is a flat object; `updateField`
// takes the section name so every component just calls
// `updateField('cargo', 'hsCode', value)` regardless of how deep the
// form eventually grows.
import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  parties: {
    exporterCompany: 'ABC Exports Pvt. Ltd.', exporterContact: 'Rahul Sharma',
    exporterEmail: 'rahul@abcexports.com', exporterPhone: '+91 98765 43210',
    exporterAddress: '123, Export House, Koper',
    importerCompany: 'XYZ Imports Ltd.', importerContact: 'John Smith',
    importerEmail: 'john@xyzimports.com', importerPhone: '+31 612 355 678',
    importerAddress: '456, Trade Street, Rotterdam, Netherlands',
    shipperCompany: 'ABC Exports Pvt. Ltd.', shipperContact: 'Rahul Sharma',
    shipperAddress: '123, Export House, Koper, India',
    consigneeCompany: 'XYZ Imports Ltd.', consigneeContact: 'John Smith',
    consigneeAddress: '456, Trade Street, Rotterdam, Netherlands',
    notifyCompany: 'Notify Co. Ltd.', notifyContact: 'Mike Johnson',
    notifyAddress: '456, Trade Street, Rotterdam, Netherlands',
  },
  cargo: {
    commodity: 'Industrial Machinery Parts', hsCode: '8479.89', cargoType: 'General',
    dgStatus: 'Non-DG', cargoValueCurrency: 'USD', cargoValue: '50,000',
    packageType: 'Cartons', length: '10', weight: '25', height: '', packagesCount: '60',
    totalGrossWeight: '20,000', totalVolume: '26.00', chargeableWeight: '20,000',
    containerType: '20GP',
  },
  route: {
    pickupAddress: '123, Export House, Koper', pickupLocation: 'Koper',
    originPort: 'Nhava Sheva (JNPT), India', destinationPort: 'Rotterdam, Netherlands',
    deliveryAddress: '456, Trade Street, Rotterdam, Netherlands',
    shipmentMode: 'sea',
    pickupDate: '2026-06-15', eta: '2026-06-18', deliveryDate: '2026-07-12', deliveryEstimated: '2026-07-15',
  },
  commercial: {
    incoterm: 'FOB – Free On Board', paymentTerms: 'Prepaid',
    currency: 'USD – US Dollar', insurance: 'Not Included', exchangeRate: '1 USD = 1.00 USD',
  },
};

export function useQuoteForm() {
  const [form, setForm] = useState(INITIAL_STATE);

  const updateField = useCallback((section, field, value) => {
    setForm((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  }, []);

  const setShipmentMode = useCallback((mode) => {
    setForm((prev) => ({ ...prev, route: { ...prev.route, shipmentMode: mode } }));
  }, []);

  const setContainerType = useCallback((type) => {
    setForm((prev) => ({ ...prev, cargo: { ...prev.cargo, containerType: type } }));
  }, []);

  return { form, updateField, setShipmentMode, setContainerType };
}
