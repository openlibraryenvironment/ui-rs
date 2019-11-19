import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import SettingPage from './SettingPage';

class ResourceSharingSettings extends React.Component {
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      path: 'rs/settings/appSettings',
    },
  });

  static propTypes = {
    resources: PropTypes.shape({
      settings: PropTypes.shape({
        records: PropTypes.array
      })
    }),
  };

  getSectionsList() {
    const rows = (this.props.resources.settings ? this.props.resources.settings.records : []);
    const sections = Array.from(new Set(rows.map(obj => obj.section)));
    return (sections);
  }

  customComponentMaker(sectionName) {
    return (props) => <SettingPage sectionName={sectionName} />;
  }

  pageList() {
    const sections = this.getSectionsList();
    const pages = sections.map(section => {
      const route = section.replace(' ', '_').toLowerCase();
      let label = section.replace('_', ' ').toLowerCase();
      label = label.charAt(0).toUpperCase() + label.substring(1) + ' settings';
      return (
        {
          'route': route,
          'label': label,
          'component': this.customComponentMaker(section)
        }
      );
    });
    return (pages);
  }

  // Backup sections for initial render (Settings doesn't render dynamically properly at first).
  // Whenever new sections are added, they won't show up on first render unless added here.
  staticSettingsSections = [
    {
      label: 'General',
      pages: [
        {
          route: 'shared_index',
          label: 'Shared index settings',
          component: this.customComponentMaker('shared_index')
        },
        {
          route: 'z3950',
          label: 'Z3950 settings',
          component: this.customComponentMaker('z3950')
        },
        {
          route: 'requests',
          label: 'Requests settings',
          component: this.customComponentMaker('requests')
        },
        {
          route: 'requester_validation',
          label: 'Requester validation settings',
          component: this.customComponentMaker('Requester Validation')
        },
        {
          route: 'local_ncip',
          label: 'Local ncip settings',
          component: this.customComponentMaker('Local NCIP')
        },
      ],
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

  render() {
    const pageList = this.pageList();

    // Doing this in render to force update once it's grabbed the sections lists
    const dynamicSettingsSections = [
      {
        label: 'General',
        pages: pageList,
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

    if (pageList[0]) {
      return (
        <Settings {...this.props} sections={dynamicSettingsSections} paneTitle={<FormattedMessage id="ui-rs.meta.title" />} />
      );
    } else {
      return (
        <Settings {...this.props} sections={this.staticSettingsSections} paneTitle={<FormattedMessage id="ui-rs.meta.title" />} />
      );
    }
  }
}

export default stripesConnect(ResourceSharingSettings);
