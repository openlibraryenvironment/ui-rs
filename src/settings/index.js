import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import GeneralSettings from './GeneralSettings';
import SomeFeatureSettings from './SomeFeatureSettings';
import Z3950Settings from './Z3950Settings';

class ResourceSharingSettings extends React.Component {
  settingsSections = [
    {
      label: 'General',
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
        {
          route: 'z3950',
          label: <FormattedMessage id="ui-rs.settings.z3950" />,
          component: Z3950Settings,
        },
      ],
    },
    {
      label: 'Request',
      pages: [],
    },
    {
      label: 'Supply',
      pages: [
        
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
