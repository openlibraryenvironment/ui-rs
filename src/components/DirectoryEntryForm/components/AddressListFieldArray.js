import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useKiwtFieldArray } from '@k-int/stripes-kint-components';

import {
  Button,
} from '@folio/stripes/components';

import AddressField from './AddressField';

const AddressListFieldArray = ({
  fields: {
    name
  }
}) => {
  const {
    items,
    onAddField,
    onDeleteField
  } = useKiwtFieldArray(name);

  const renderAddAddress = () => {
    return (
      <Button
        id="add-address-btn"
        onClick={() => onAddField()}
      >
        <FormattedMessage id="ui-directory.information.addresses.add" />
      </Button>
    );
  };

  return (
    <>
      {items?.map((address, index) => (
        <AddressField
          address={address}
          index={index}
          name={name}
          onDeleteField={onDeleteField}
        />
      ))}
      {renderAddAddress()}
    </>
  );
};

AddressListFieldArray.propTypes = {
  fields: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
};

export default AddressListFieldArray;
