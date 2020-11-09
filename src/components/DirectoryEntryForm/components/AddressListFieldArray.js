import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Col,
  MessageBanner,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import pluginGeneric from '@folio/address-plugin-generic';
import pluginNA from '@folio/address-plugin-north-america';
import pluginGBR from '@folio/address-plugin-british-isles';

import { required } from '../../../util/validators';

const plugins = [pluginGeneric, pluginNA, pluginGBR];
const pluginMap = {};
plugins.forEach(plugin => {
  plugin.listOfSupportedCountries.forEach(country => {
    pluginMap[country] = plugin;
  });
});

class AddressListFieldArray extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      map: PropTypes.func,
    })),
    name: PropTypes.string,
    onAddField: PropTypes.func.isRequired,
    onDeleteField: PropTypes.func.isRequired
  };

  renderAddAddress = () => {
    return (
      <Button
        id="add-address-btn"
        onClick={() => this.props.onAddField()}
      >
        <FormattedMessage id="ui-directory.information.addresses.add" />
      </Button>
    );
  }

  renderCardHeader = (index) => {
    const { intl } = this.props;
    return (
      <Col xs={8}>
        <Field
          name={`${this.props.name}[${index}].addressLabel`}
          component={TextField}
          placeholder={intl.formatMessage({ id: 'ui-directory.information.addresses.namePlaceholder' })}
          required
          validate={required}
        />
      </Col>
    );
  }

  renderWarning(domain, plugin) {
    const { intl } = this.props;
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

  render() {
    const { intl, items } = this.props;
    const supportedAddressFormats = [{ value: '', label: '', disabled: true }];
    plugins.forEach(plugin => {
      plugin.listOfSupportedCountries.forEach(country => {
        supportedAddressFormats.push({ value: country, label: intl.formatMessage({ id: `ui-${plugin.pluginName}.${country}.countryCode` }) });
      });
    });

    return (
      <>
        {items?.map((address, index) => {
          const domain = address.countryCode;
          const plugin = pluginMap[domain] ? pluginMap[domain] : pluginMap.Generic;
          return (
            <EditCard
              header={this.renderCardHeader(index)}
              key={`${this.props.name}[${index}].editCard`}
              onDelete={() => this.props.onDeleteField(index, address)}
            >
              <Field
                name={`${this.props.name}[${index}].countryCode`}
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
                  name={`${this.props.name}[${index}]`}
                >
                  {props => {
                    return (
                      <plugin.addressFields
                        {...props}
                        country={domain}
                        textFieldComponent={TextField}
                        requiredValidator={required}
                        name={`${this.props.name}[${index}]`}
                        savedAddress={address}
                      />
                    );
                  }}
                </Field>
              }
              {this.renderWarning(domain, plugin)}
            </EditCard>
          );
        })}
        {this.renderAddAddress()}
      </>
    );
  }
}

export default injectIntl(withKiwtFieldArray(AddressListFieldArray));
