import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Field, useForm } from 'react-final-form';

import {
  Col,
  MessageBanner,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard } from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';

import { pluginMap, useSupportedAddressFormats } from "../../../util/pluginMap";

const AddressField = ({
  address = {},
  index,
  name,
  onDeleteField
}) => {
  const intl = useIntl();
  const supportedAddressFormats = useSupportedAddressFormats();
  const [domain, setDomain] = useState(address.countryCode);
  const [plugin, setPlugin] = useState(pluginMap[domain] ?? pluginMap.Generic);

  const { change } = useForm();

  useEffect(() => {
    // Don't bother with this change if we're deleting the thing or there is no countryCode;
    if (!address?._delete && address.countryCode) {
      const { addressLabel, countryCode, id, lines, ..._restOfAddress } = address;
      setDomain(address.countryCode);
      const newPlugin = pluginMap[address.countryCode] ?? pluginMap.Generic;
      setPlugin(newPlugin);
      
      // When changing country code, automatically change country field with it
      const newCountry = intl.formatMessage({ id: `ui-${newPlugin.pluginName}.${countryCode}.countryCode` })
  
      const newAddress = {
        addressLabel,
        countryCode,
        id,
        lines,
        ...newPlugin.backendToFields(address),
        country: newCountry
      };
  
      change(`${name}[${index}]`, newAddress);
    }
  }, [address.countryCode]);

  const renderWarning = () => {
    let warning = '';
    if (domain && (!plugin || (plugin === pluginMap.Generic && domain !== 'Generic')) && !warning) {
      warning = intl.formatMessage({ id: 'ui-directory.information.addresses.missingPlugin' });
    }
    return (
      warning ? (
        <MessageBanner type="warning">
          {warning}
        </MessageBanner>
      ) : null
    );
  }

  const renderCardHeader = () => {
    return (
      <Col xs={8}>
        <Field
          component={TextField}
          marginBottom0
          name={`${name}[${index}].addressLabel`}
          placeholder={intl.formatMessage({ id: 'ui-directory.information.addresses.namePlaceholder' })}
          required
          validate={required}
        />
      </Col>
    );
  };

  return (
    <EditCard
      header={renderCardHeader()}
      key={`${name}[${index}].editCard`}
      onDelete={() => onDeleteField(index, address)}
    >
      <Field
        name={`${name}[${index}].countryCode`}
        label={<FormattedMessage id="ui-directory.information.addresses.format" />}
        parse={v => v}
        required
        validate={required}
      >
        {({ input }) => (
          <Select
            {...input}
            dataOptions={supportedAddressFormats}
          />
        )}
      </Field>
      {plugin && domain &&
        <Field
          name={`${name}[${index}]`}
        >
          {props => {
            return (
              <plugin.addressFields
                {...props}
                country={domain}
                textFieldComponent={TextField}
                name={`${name}[${index}]`}
                savedAddress={address}
              />
            );
          }}
        </Field>
      }
      {renderWarning()}
    </EditCard>
  );
};

AddressField.propTypes = {
  address: PropTypes.object,
  index: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  onDeleteField: PropTypes.func.isRequired
};

export default AddressField;
