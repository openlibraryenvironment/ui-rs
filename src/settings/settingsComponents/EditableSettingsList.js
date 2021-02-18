import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import { Pane } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import EditableSettingsListFieldArray from './EditableSettingsListFieldArray';

class EditableSettingsList extends React.Component {
  static propTypes = {
    onSave: PropTypes.func,
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
      data,
      settingSection,
      initialValues,
    } = this.props;

    return (
      <Form
        onSubmit={this.handleSave}
        initialValues={initialValues}
        enableReinitialize
        keepDirtyOnReinitialize
        mutators={{
          setSettingValue: (args, state, tools) => {
            tools.changeValue(state, args[0], () => args[1]);
          },
          ...arrayMutators
        }}
        subscription={{ value: true }}
        navigationCheck
      >
        {({ handleSubmit, mutators }) => (
          <Pane
            defaultWidth="fill"
            id={`settings-${settingSection}`}
            paneTitle={<FormattedMessage id={`ui-rs.settingsSection.${settingSection}`} />}
          >
            <form onSubmit={handleSubmit}>
              <FieldArray
                component={EditableSettingsListFieldArray}
                name="settings"
                onSave={this.handleSave}
                mutators={mutators}
                data={data}
                initialValues={initialValues}
              />
            </form>
          </Pane>
        )}
      </Form>
    );
  }
}

export default EditableSettingsList;
