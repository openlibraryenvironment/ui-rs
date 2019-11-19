import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core'

import { EditableSettingsList } from './settingsComponents';
import { FormattedMessage } from 'react-intl';

class RequesterValidationSettings extends React.Component {
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      path: 'rs/settings/appSettings',
      params: {
        stats: true,
        filters: "&section=Z3950"
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
    const rows = (this.props.resources.settings ? this.props.resources.settings.records : []);
    const settings = {"settings": rows}
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

export default stripesConnect(RequesterValidationSettings);
