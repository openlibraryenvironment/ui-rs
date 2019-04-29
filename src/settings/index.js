import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import GeneralSettings from './general-settings';
import SomeFeatureSettings from './some-feature-settings';

/*
  STRIPES-NEW-APP
  Your app's settings pages are defined here.
  The pages "general" and "some feature" are examples. Name them however you like.
*/

export default class ResourceSharingSettings extends React.Component {
  pages = [
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
  ];

  render() {
    return (
      <Settings {...this.props} pages={this.pages} paneTitle="Resource Sharing" />
    );
  }
}
