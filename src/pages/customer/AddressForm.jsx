import Field from '../../components/Field';

export const emptyAddress = { fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: '', defaultAddress: false };

/** Controlled address fields shared by Addresses and Checkout. */
export default function AddressForm({ value, onChange, errors = {} }) {
  const set = (k) => (e) => onChange({ ...value, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  return (
    <div className="form-grid">
      <Field label="Full name" value={value.fullName} onChange={set('fullName')} error={errors.fullName} required />
      <Field label="Phone" value={value.phone} onChange={set('phone')} error={errors.phone} required />
      <Field label="Address line 1" value={value.line1} onChange={set('line1')} error={errors.line1} required />
      <Field label="Address line 2" value={value.line2 || ''} onChange={set('line2')} />
      <Field label="City" value={value.city} onChange={set('city')} error={errors.city} required />
      <Field label="State" value={value.state || ''} onChange={set('state')} />
      <Field label="Postal code" value={value.postalCode} onChange={set('postalCode')} error={errors.postalCode} required />
      <Field label="Country" value={value.country} onChange={set('country')} error={errors.country} required />
    </div>
  );
}
