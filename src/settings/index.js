import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import SettingPage from './SettingPage';

class ResourceSharingSettings extends React.Component { 
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      path: 'rs/settings/appSettings',
      //records: 'results',
    },
  });

  getSectionsList() {
    const rows = (this.props.resources.settings ? this.props.resources.settings.records : []);
    const sections = Array.from(new Set(rows.map(obj => obj.section)))
    return(sections);
  }

  customComponentMaker(section_name) {
    const custComp = <SettingPage section_name={section_name} />
    return (custComp);
  }

  pageList() {
    let sections = this.getSectionsList();
    const pages = sections.map(section => {
      return (
        {
          "route": section.replace(' ', '_').toLowerCase(),
          "label": section,
          "component": this.customComponentMaker(section)
        }
      );
    });
    return ( pages );
  }

  settingsSections = [
    {
      label: 'General',
      pages: [
        {
          route: 'requester-validation',
          label: <FormattedMessage id="ui-rs.settings.requester-validation" />,
          component: SettingPage,
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
    console.log("Pages: %o", this.pageList())
    return (
      <Settings {...this.props} sections={this.settingsSections} paneTitle="Resource Sharing" />
    );
  }
}

export default stripesConnect(ResourceSharingSettings);
