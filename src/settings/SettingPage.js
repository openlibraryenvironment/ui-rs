import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';

import { EditableSettingsList } from './settingsComponents';
import { FormattedMessage } from 'react-intl';

class SettingPage extends React.Component {
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      path: 'rs/settings/appSettings',
      params: {
        stats: true,
      },
      records: 'results',
    },
    refdatavalues: {
      type: 'okapi',
      path: 'rs/refdata',
    }
  });


  static propTypes = {
    stripes: PropTypes.object.isRequired,
  };

  handleSubmit = (setting) => {
    const mutator = this.props.mutator.settings;
    const promise = mutator.PUT(setting)

    return promise;
  }

  render() {
    const { sectionName } = this.props;

    // We grab the rows and check for a valid filter

    const rows = (this.props.resources.settings ? this.props.resources.settings.records : []);
    const filteredRows = sectionName ? rows.filter(obj => obj.section === sectionName) : rows;

    const settings = {"settings": filteredRows}
    const refdatavalues = (this.props.resources.refdatavalues ? this.props.resources.refdatavalues.records : [])

    return (
      <EditableSettingsList 
        data={{
          refdatavalues
        }}
        settingSection="requester-validation"
        initialValues={settings}
        onSave={this.handleSubmit}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

export default stripesConnect(SettingPage);
