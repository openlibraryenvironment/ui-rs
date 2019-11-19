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
    return (props) => <SettingPage section_name={section_name} />;
  }

  pageList() {
    let sections = this.getSectionsList();
    const pages = sections.map(section => {
      const route = section.replace(' ', '_').toLowerCase()
      let label = section.replace('_', ' ').toLowerCase()
      label = label.charAt(0).toUpperCase() + label.substring(1) + " settings";
      return (
        {
          "route": route,
          "label": label,
          "component": this.customComponentMaker(section)
        }
      );
    });
    return ( pages );
  }


  render() {

    // Doing this in render to force update once it's grabbed the sections lists
    const settingsSections = [
      {
        label: 'General',
        pages: this.pageList(),
      },
      {
        label: 'Request',
        pages: [],
      },
      {
        label: 'Supply',
        pages: [],
      },
    ];

    return (
      <Settings {...this.props} sections={settingsSections} paneTitle="Resource Sharing" />
    );
  }
}

export default stripesConnect(ResourceSharingSettings);
