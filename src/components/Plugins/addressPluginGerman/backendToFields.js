import { getExistingLineField } from '@k-int/address-utils';

const backendToFields = (address) => {
  const addressFields = {};

  const fieldNames = [
    'institution',
    'library',
    'department',
    'street',
    'number',
    'zipCode',
    'town',
    'country'
  ];

  fieldNames.forEach(field => {
    const value = getExistingLineField(address.lines, field)?.value;
    if (value) {
      addressFields[field] = value;
    }
  });

  return addressFields;
};

export default backendToFields;
