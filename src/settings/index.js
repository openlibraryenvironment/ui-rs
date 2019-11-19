import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import RequesterValidationSettings from './RequesterValidationSettings';

class ResourceSharingSettings extends React.Component {
  settingsSections = [
    {
      label: 'General',
      pages: [
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
