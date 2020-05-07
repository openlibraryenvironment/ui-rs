import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';
import SettingPage from './SettingPage';
import { CustomISO18626 } from './settingsComponents';


function routeAlphaSort(a, b) {
  if (a.route < b.route) return -1;
  if (a.route > b.route) return 1;
  return 0;
}


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
    return pages;
  }

  persistentPages = [
    {
      route: 'CustomISO18626Settings',
      label: 'Custom ISO18626 settings',
      component: CustomISO18626
    }
  ];

  render() {
    const pageList = this.pageList();
    if (!pageList[0]) return <b>No settings yet</b>;

    const settingsToRender = this.persistentPages.concat(pageList).sort(routeAlphaSort);
    return (
      <Settings {...this.props} pages={settingsToRender} paneTitle={<FormattedMessage id="ui-rs.meta.title" />} />
    );
  }
}

export default stripesConnect(ResourceSharingSettings);
