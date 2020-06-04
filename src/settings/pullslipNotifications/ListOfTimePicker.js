import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { RepeatableField, Timepicker } from '@folio/stripes/components';


class ListOfTimePicker extends React.Component {
  render() {
    const { name, legend, addLabel, timeZone } = this.props;

    return (
      <FieldArray
        name={name}
        legend={legend}
        addLabel={addLabel}
        component={RepeatableField}
        onAdd={fields => fields.push('')}
        renderField={field => (
          <Field
            component={(props) => <Timepicker {...props} timeZone={timeZone} />}
            name={field}
          />
        )}
      />
    );
  }
}

ListOfTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  legend: PropTypes.string,
  addLabel: PropTypes.string,
  timeZone: PropTypes.string,
};

export default ListOfTimePicker;
