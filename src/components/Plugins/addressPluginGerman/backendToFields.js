import { getExistingLineField } from '@k-int/address-utils';

const backendToFields = (address) => {
  const addressFields = {};

  const institution = getExistingLineField(address.lines, 'institution')?.value;
  const library = getExistingLineField(address.lines, 'library')?.value;
  const department = getExistingLineField(address.lines, 'department')?.value;
  const street = getExistingLineField(address.lines, 'street')?.value;
  const number = getExistingLineField(address.lines, 'number')?.value;
  const zipCode = getExistingLineField(address.lines, 'zipCode')?.value;
  const town = getExistingLineField(address.lines, 'town')?.value;
  const country = getExistingLineField(address.lines, 'country')?.value;

  if (institution) {
    addressFields.institution = institution;
  }
  if (library) {
    addressFields.library = library;
  }
  if (department) {
    addressFields.department = department;
  }
  if (street) {
    addressFields.street = street;
  }
  if (number) {
    addressFields.number = number;
  }
  if (zipCode) {
    addressFields.zipCode = zipCode;
  }
  if (town) {
    addressFields.town = town;
  }
  if (country) {
    addressFields.country = country;
  }

  return addressFields;
};

export default backendToFields;
