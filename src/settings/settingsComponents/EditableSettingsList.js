import React from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'react-final-form-arrays';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import EditableSettingsListFieldArray from './EditableSettingsListFieldArray';

class EditableSettingsList extends React.Component {
  static propTypes = {
    onSave: PropTypes.func,
    data: PropTypes.shape({
      refdatavalues: PropTypes.arrayOf(PropTypes.object)
    }),
    initialValues: PropTypes.object
  };

  handleSave = (...rest) => {
    return this.props.onSave(...rest);
  }

  render() {
    const {
      data,
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
        )}
      </Form>
    );
  }
}

export default EditableSettingsList;
