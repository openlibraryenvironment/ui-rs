import { deleteFieldIfExists, getExistingLineField } from '@k-int/address-utils';

const fieldsToBackend = (address) => {
  const addressId = address.id || null;
  const countryCode = address.countryCode || null;
  const newAddress = {};
  let lines = [];

  // Array of address fields to process
  const fieldNames = [
    { key: 'premise', label: 'Premise' },
    { key: 'department', label: 'Department' },
    { key: 'thoroughfare', label: 'Thoroughfare' },
    { key: 'postalcode', label: 'PostalCode' },
    { key: 'postalcodeortown', label: 'PostalCodeOrTown' },
    { key: 'country', label: 'Country' }
  ];

  // Loop through each field and apply logic
  fieldNames.forEach(({ key, label }) => {
    if (address[key]) {
      const id = getExistingLineField(address.lines, key)?.id;
      lines.push({ type: { value: label }, value: address[key], id });
    } else {
      const deletedField = deleteFieldIfExists(address.lines, key);
      if (deletedField !== null) {
        lines.push(deletedField);
      }
    }
  });

  newAddress.addressLabel = address.addressLabel;
  newAddress.lines = lines.filter(line => line !== null);
  newAddress.id = addressId;
  newAddress.countryCode = countryCode;

  return newAddress;
};

export default fieldsToBackend;
