import React from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';
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
    label: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);
  }
  render() {
    const{ stripes } = this.props;
    return (
      <this.connectedControlledVocab
        stripes={stripes}
        baseUrl="rs/settings/appSettings"
        label={<FormattedMessage id="ui-rs.settings.supply-address-settings" />}
        labelSingular={<FormattedMessage id="ui-rs.settings.supply-address.Address" />}
        objectLabel={<FormattedMessage id="ui-rs.settings.supply-address-settings" />}
        visibleFields={['key', 'value']}
        columnMapping={{
          st_key: <FormattedMessage id="ui-rs.settings.supply-address.Name" />,
          st_value: <FormattedMessage id="ui-rs.settings.supply-address.Value" />,
        }}
        id="addresses"
        sortby="value"
        hiddenFields={['id', 'version', 'section', 'settingType', 'vocab', 'defValue', 'lastUpdated','numberOfObjects']}
        limitParam="perPage"
      />
    );
  }
}

export default withStripes(SupplyAddressSettings);