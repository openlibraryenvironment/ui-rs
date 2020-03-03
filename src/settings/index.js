import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import SettingPage from './SettingPage';
import { CustomISO18626 } from './settingsComponents';

class ResourceSharingSettings extends React.Component {
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      path: 'rs/settings/appSettings',
      params: {
        max: '500',
      },
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
    return (props) => <SettingPage sectionName={sectionName} {...props} />;
  }

  routeAlphaSort = (a, b) => {
    if (a.route < b.route) {
      return -1;
    }
    if (a.route > b.route) {
      return 1;
    }
    return 0;
  };

  pageList() {
    const sections = this.getSectionsList();
    const pages = sections.map(section => {
      if (section) {
        const route = section;
        const label = <FormattedMessage id={`ui-rs.settingsSection.${section}`} />;
        return (
          {
            'route': route,
            'label': label,
            'component': this.customComponentMaker(section)
          }
        );
      } else {
        return (undefined);
      }
    });
    return (pages.sort((a, b) => this.routeAlphaSort(a, b)));
  }

  // Backup pages for initial render (Settings doesn't render dynamically properly at first).
  // Whenever new sections are added, they won't show up on first render unless added here.
  // They should be in alphabetical order (by route) here, to match the sorted dynamic list.
  staticSettingsPages = [
    {
      route: 'AutoResponder',
      label: 'Auto responder settings',
      component: this.customComponentMaker('autoResponder')
    },
    {
      route: 'Chat',
      label: 'Chat settings',
      component: this.customComponentMaker('chat')
    },
    {
      route: 'HostLMSIntegration',
      label: 'Host LMS integration',
      component: this.customComponentMaker('hostLMSIntegration')
    },
    {
      route: 'localNCIP',
      label: 'Local NCIP settings',
      component: this.customComponentMaker('localNCIP')
    },
    {
      route: 'requesterValidation',
      label: 'Requester validation',
      component: this.customComponentMaker('requesterValidation')
    },
    {
      route: 'requests',
      label: 'Request defaults',
      component: this.customComponentMaker('requests')
    },
    {
      route: 'sharedIndex',
      label: 'Shared index settings',
      component: this.customComponentMaker('sharedIndex')
    },
    {
      route: 'z3950',
      label: 'Z39.50 settings',
      component: this.customComponentMaker('z3950')
    }
  ];

  persistentPages = [
    {
      route: 'CustomISO18626Settings',
      label: 'Custom ISO18626 settings',
      component: CustomISO18626
    }
  ];

  render() {
    const pageList = this.pageList();

    // Doing this in render to force update once it's grabbed the page list
    const dynamicSettingsPages = pageList;
    let settingsToRender = [];

    if (pageList[0]) {
      settingsToRender = this.persistentPages.concat(dynamicSettingsPages).sort((a, b) => this.routeAlphaSort(a, b));
    } else {
      settingsToRender = this.persistentPages.concat(this.staticSettingsPages).sort((a, b) => this.routeAlphaSort(a, b));
    }

    return (
      <Settings {...this.props} pages={settingsToRender} paneTitle={<FormattedMessage id="ui-rs.meta.title" />} />
    );
  }
}

export default stripesConnect(ResourceSharingSettings);
