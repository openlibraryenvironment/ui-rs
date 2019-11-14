import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import RequesterValidationSettings from './RequesterValidationSettings';
import LocalNCIPSettings from './LocalNCIPSettings';
import Z3950Settings from './Z3950Settings';

class ResourceSharingSettings extends React.Component {
  settingsSections = [
    {
      label: 'General',
      pages: [
        {
          route: 'local-ncip',
          label: <FormattedMessage id="ui-rs.settings.local-ncip" />,
          component: LocalNCIPSettings,
        },
        {
          route: 'z3950',
          label: <FormattedMessage id="ui-rs.settings.z3950" />,
          component: Z3950Settings,
        },
        {
          route: 'requester-validation',
          label: <FormattedMessage id="ui-rs.settings.requester-validation" />,
          component: RequesterValidationSettings,
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
