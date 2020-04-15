import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import { FieldArray } from 'react-final-form-arrays';

import {
  Col,
  TextField,
} from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';

import AddressLineListField from './AddressLineListField';
import { required } from '../../../util/validators';

class AddressListField extends React.Component {
  static propTypes = {
    address: PropTypes.object,
    index: PropTypes.number,
    input: PropTypes.shape({
      name: PropTypes.string,
    }),
    intl: PropTypes.object.isRequired,
    onDeleteField: PropTypes.func.isRequired,
  };

  renderCardHeader = (index) => {
    const { intl } = this.props;
    return (
      <Col xs={8}>
        <Field
          name={`addresses[${index}].addressLabel`}
          component={TextField}
          placeholder={intl.formatMessage({ id: 'ui-directory.information.addresses.namePlaceholder' })}
          required
          validate={required}
        />
      </Col>
    );
  }

  render() {
    const { address, index, input: { name } } = this.props;
    return (
      <EditCard
        header={this.renderCardHeader(index)}
        key={`addresses[${index}].editCard`}
        onDelete={() => this.props.onDeleteField(index, address)}
      >
        <FieldArray
          name={`${name}.lines`}
        >
          {({ fields, input, meta }) => <AddressLineListField {... { fields, input, meta }} /> }
        </FieldArray>
      </EditCard>
    );
  }
}

export default injectIntl(AddressListField);
