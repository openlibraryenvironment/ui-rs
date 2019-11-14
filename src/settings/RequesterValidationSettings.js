import React from 'react';
import PropTypes from 'prop-types';
import { withStripes } from '@folio/stripes/core';

import { Form } from 'react-final-form';

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
    this.props.mutator.selectedRecordId.replace(setting.id);
    return this.props.mutator.selectedRecord.PUT(setting);
  }



  render() {
    const rows = (this.props.resources.settings ? this.props.resources.settings.records : []);
    const refdatavalues = (this.props.resources.refdatavalues ? this.props.resources.refdatavalues.records : [])
    return (
      <Paneset>
        <Pane
          defaultWidth='fill'
          paneTitle={<FormattedMessage id="ui-rs.settings.requester-validation" />}
        >
          <Form onSubmit={this.handleSubmit}>
            {(...props) => (
              <form id="requester-validation-settings" >
                <EditableSettingsList 
                  data={{
                    settings: rows,
                    refdatavalues
                  }}
                  onSubmit={this.handleSubmit}
                />
              </form>
            )}
          </Form>
        </Pane>
      </Paneset>
      
    );
  }
}

export default RequesterValidationSettings;
