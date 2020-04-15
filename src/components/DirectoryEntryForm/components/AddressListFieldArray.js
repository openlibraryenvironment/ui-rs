import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
} from '@folio/stripes/components';

import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import AddressListField from './AddressListField';

class AddressListFieldArray extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      map: PropTypes.func,
    })),
    name: PropTypes.string,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired,
  };

  renderAddAddress = () => {
    const defaultLines = [
      {
        seq: 0,
        type: { value: 'Thoroughfare' },
      },
      {
        seq: 1,
        type: { value: 'Thoroughfare' },
      },
      {
        seq: 2,
        type: { value: 'Locality' },
      },
      {
        seq: 3,
        type: { value: 'PostalCode' },
      },
      {
        seq: 4,
        type: { value: 'AdministrativeArea' },
      },
    ];

    return (
      <Button
        id="add-address-btn"
        onClick={() => this.props.onAddField({ lines: defaultLines })}
      >
        <FormattedMessage id="ui-directory.information.addresses.add" />
      </Button>
    );
  }

  render() {
    const { items } = this.props;
    return (
      <>
        {items?.map((address, index) => {
          return (
            <Field
              name={`${this.props.name}[${index}]`}
              component={AddressListField}
              key={index}
              index={index}
              address={address}
              onDeleteField={() => this.props.onDeleteField(index, address)}
            />
          );
        })}
        {this.renderAddAddress()}
      </>
    );
  }
}

export default withKiwtFieldArray(AddressListFieldArray);
