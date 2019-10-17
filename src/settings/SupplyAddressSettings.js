import React from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes/core';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { FormattedMessage } from 'react-intl';

class SupplyAddressSettings extends React.Component {
  static manifest = Object.freeze({
    setting: {
      type: 'okapi',
      path: 'rs/settings/appSettings?stats=true',
    },
  });

  static propTypes = {
    stripes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }

  render() {
    const { stripes } = this.props;
    return (
      <this.connectedControlledVocab
        stripes={stripes}
        baseUrl="rs/settings/appSettings"
        label={<FormattedMessage id="ui-rs.settings.supply-address.addresses" />}
        labelSingular={<FormattedMessage id="ui-rs.settings.supply-address.address" />}
        objectLabel={<FormattedMessage id="ui-rs.settings.supply-address.addresses" />}
        visibleFields={['key', 'value']}
        columnMapping={{
          st_key: <FormattedMessage id="ui-rs.settings.supply-address.name" />,
          st_value: <FormattedMessage id="ui-rs.settings.supply-address.value" />,
        }}
        id="addresses"
        sortby="value"
        hiddenFields={['id', 'version', 'section', 'settingType', 'vocab', 'defValue', 'lastUpdated', 'numberOfObjects']}
        limitParam="perPage"
      />
    );
  }
}

export default withStripes(SupplyAddressSettings);
