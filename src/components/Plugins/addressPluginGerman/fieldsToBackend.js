import { deleteFieldIfExists, getExistingLineField } from '@k-int/address-utils';

const fieldsToBackend = (address) => {
  const addressId = address.id || null;
  const countryCode = address.countryCode || null;
  const newAddress = {};
  let lines = [];

  if (address.institution) {
    const id = getExistingLineField(address.lines, 'institution')?.id;
    lines.push({ type: { value: 'Institution' }, value: address.institution, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'institution'));
  }

  if (address.library) {
    const id = getExistingLineField(address.lines, 'library')?.id;
    lines.push({ type: { value: 'Library' }, value: address.library, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'library'));
  }

  if (address.department) {
    const id = getExistingLineField(address.lines, 'department')?.id;
    lines.push({ type: { value: 'Department' }, value: address.department, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'department'));
  }

  if (address.street) {
    const id = getExistingLineField(address.lines, 'street')?.id;
    lines.push({ type: { value: 'Street' }, value: address.street, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'street'));
  }

  if (address.number) {
    const id = getExistingLineField(address.lines, 'number')?.id;
    lines.push({ type: { value: 'Number' }, value: address.number, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'number'));
  }

  if (address.zipCode) {
    const id = getExistingLineField(address.lines, 'zipCode')?.id;
    lines.push({ type: { value: 'Zip code' }, value: address.zipCode, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'zipCode'));
  }

  if (address.town) {
    const id = getExistingLineField(address.lines, 'town')?.id;
    lines.push({ type: { value: 'Town' }, value: address.town, id });
  } else {
    lines.push(deleteFieldIfExists(address.lines, 'town'));
  }

  if (address.country) {
    const id = getExistingLineField(address.lines, 'country')?.id;
    lines.push({ type: { value: 'Country' }, value: address.country, id });
  }

  lines = lines.filter(line => (line !== null));
  newAddress.addressLabel = address.addressLabel;
  newAddress.lines = lines;
  newAddress.id = addressId;
  newAddress.countryCode = countryCode;
  return newAddress;
};

export default fieldsToBackend;
