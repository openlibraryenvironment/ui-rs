import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';

import { EditableSettingsList } from './settingsComponents';

class SettingPage extends React.Component {
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      path: 'rs/settings/appSettings',
      params: {
        max: '500',
        stats: true,
      },
      records: 'results',
    },
    refdatavalues: {
      type: 'okapi',
      path: 'rs/refdata',
      params: {
        max: '500',
      },
    },
    templates: {
      type: 'okapi',
      path: 'rs/template',
      params: {
        max: '500',
      },
    }
  });

  static propTypes = {
    mutator: PropTypes.shape({
      settings: PropTypes.object
    }),
    sectionName: PropTypes.string,
    resources: PropTypes.shape({
      settings: PropTypes.shape({
        records: PropTypes.array
      }),
      refdatavalues: PropTypes.shape({
        records: PropTypes.array
      })
    })
  };

  handleSubmit = (setting) => {
    const mutator = this.props.mutator.settings;
    const promise = mutator.PUT(setting);

    return promise;
  }

  render() {
    const {
      resources: {
        templates: {
          records: tmp = []
        } = {},
        refdatavalues: {
          records: rdv = []
        } = {},
        settings: {
          records: rows = []
        } = {}
      } = {},
      sectionName
    } = this.props;

    // We grab the rows and check for a valid filter
    const filteredRows = sectionName ? rows.filter(obj => obj.section === sectionName) : rows;

    const settings = { 'settings': filteredRows };

    return (
      <EditableSettingsList
        data={{
          refdatavalues: rdv,
          templates: tmp
        }}
        initialValues={settings}
        onSave={this.handleSubmit}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(SettingPage);
