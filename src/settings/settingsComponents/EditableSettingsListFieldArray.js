import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import SettingField from './SettingField';

export default class EditableSettingsListFieldArray extends React.Component {
  static propTypes = {
    fields: PropTypes.object
  };

  handleSave = (index) => {
    const setting = this.props.fields.value[index]
    return this.props.onSave(setting)
  }

  render() {
    const { data, fields, mutators } = this.props;
    return (
      // Returns the settings in alphabetical order
      (fields.value || []).sort((a,b) => (a.key > b.key) ? 1 : ((b.key > a.key) ? -1 : 0)).map((setting, i) => (
        name = `${fields.name}[${i}]`,
        <Field
          component={SettingField}
          name={`${fields.name}[${i}].value`}
          mutators={mutators}
          onSave={() => this.handleSave(i)}
          data={{
            currentSetting: [setting, i], 
            refdatavalues: data.refdatavalues
          }}
          initialValues={this.props.initialValues}
        />
      ))
    );
  }
}
