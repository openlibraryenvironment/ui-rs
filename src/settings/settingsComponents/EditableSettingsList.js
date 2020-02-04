import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';

import { Pane } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FormattedMessage } from 'react-intl';

import EditableSettingsListFieldArray from './EditableSettingsListFieldArray';

class EditableSettingsList extends React.Component {
  static propTypes = {
    onSave: PropTypes.func,
    form: PropTypes.object,
    data: PropTypes.shape({
      refdatavalues: PropTypes.arrayOf(PropTypes.object)
    }),
    settingSection: PropTypes.string,
    initialValues: PropTypes.object
  };

  handleSave = (...rest) => {
    return this.props.onSave(...rest);
  }

  render() {
    const {
      form: { mutators },
      data
    } = this.props;
    return (
      <Pane
        defaultWidth="fill"
        id={`settings-${this.props.settingSection}`}
        paneTitle={<FormattedMessage id={`ui-rs.settingsSection.${this.props.settingSection}`} />}
      >
        <form>
          <FieldArray
            component={EditableSettingsListFieldArray}
            name="settings"
            onSave={this.handleSave}
            mutators={mutators}
            data={{
              refdatavalues: data?.refdatavalues
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
