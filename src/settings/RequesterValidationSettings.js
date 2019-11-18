import React from 'react';
import PropTypes from 'prop-types';
import { withStripes, stripesConnect } from '@folio/stripes/core';

import {
  Paneset,
  Pane,
} from '@folio/stripes/components';

import EditableSettingsList from './settingsComponents';
import { FormattedMessage } from 'react-intl';

class RequesterValidationSettings extends React.Component {
  static manifest = Object.freeze({
    settings: {
      type: 'okapi',
      path: 'rs/settings/appSettings?stats=true',
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
    const refdatavalues = (this.props.resources.refdatavalues ? this.props.resources.refdatavalues.records : [])
    const initialValues = rows.map((row) => ({key: row.key, value: row.value}))
    console.log("Setting Props: %o", this.props)
    return (
      <Paneset>
        <Pane
          defaultWidth='fill'
          paneTitle={<FormattedMessage id="ui-rs.settings.requester-validation" />}
        >
          <EditableSettingsList 
            data={{
              settings: rows,
              refdatavalues
            }}
            initialValues={initialValues}
            onSave={this.handleSubmit}
            onSubmit={this.handleSubmit}
            />
        </Pane>
      </Paneset>
      
    );
  }
}

export default stripesConnect(RequesterValidationSettings);
