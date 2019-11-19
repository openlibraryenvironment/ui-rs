import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';

import SettingPage from './SettingPage';

class SettingsPages extends React.Component {
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


  render() {
    let pages = this.getSectionsList();
    pages.map(section => {
      return (
        [
          "route": section,
          "label": section,
          //"component": this.customComponentMaker(section)
        ]
      );
    });
    console.log("Pages: %o", pages)
    return ( null );
  }

}

export default stripesConnect(SettingsPages);