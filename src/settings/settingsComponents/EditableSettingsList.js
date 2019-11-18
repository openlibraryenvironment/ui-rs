import React from 'react';
import PropTypes from 'prop-types';
import { Form } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import { Pane } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FormattedMessage } from 'react-intl';

import EditableSettingsListFieldArray from './EditableSettingsListFieldArray';

class EditableSettingsList extends React.Component {

  handleSave = (...rest) => {
    console.log("handSave called in Editable Settings List")
    return this.props.onSave(...rest)
  }


  render() {
    const {
      form: { mutators },
      data
    } = this.props;
    return (
      <Pane
        defaultWidth='fill'
        id={`settings-${this.props.settingSection}`}
        paneTitle={<FormattedMessage id="ui-rs.settings.requester-validation" />}
      >
        <form>
          <FieldArray
            component={EditableSettingsListFieldArray}
            name="settings"
            onSave={this.handleSave}
            mutators={mutators}
            data={{
              refdatavalues: data.refdatavalues
            }}
            initialValues={this.props.initialValues}
          />
        </form>
      </Pane>
    );
  }
}

export default stripesFinalForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: false,
  mutators: {
    setSettingValue: (args, state, tools) => {
      tools.changeValue(state, args[0], () => args[1]);
    },
  },
  subscription: {
    value: true
  },
  navigationCheck: true,
})(EditableSettingsList);