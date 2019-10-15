import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import GeneralSettings from './GeneralSettings';
import SomeFeatureSettings from './SomeFeatureSettings';
import SupplyAddressSettings from './SupplyAddressSettings';

class ResourceSharingSettings extends React.Component {
 
  settingsSections = [
    {
      label: "General",
      pages: [
        {
          route: 'general',
          label: <FormattedMessage id="ui-rs.settings.general" />,
          component: GeneralSettings,
        },
        {
          route: 'somefeature',
          label: <FormattedMessage id="ui-rs.settings.some-feature" />,
          component: SomeFeatureSettings,
        },
      ],
    },
    {
      label: "Request",
      pages: [],
    },
    {
      label: "Supply",
      pages: [
        {
        route: 'supplyaddress',
        label: <FormattedMessage id="ui-rs.settings.supply-address.addressSettings" />,
        component: SupplyAddressSettings,
        },
      ],
    },
  ];

  render() {
    return (
      <Settings {...this.props} sections={this.settingsSections} paneTitle="Resource Sharing" />
    );
  }
}

export default stripesConnect(ResourceSharingSettings);
