import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { RepeatableField, Timepicker } from '@folio/stripes/components';

const ListOfTimePicker = (props) => <FieldArray
  name={props.name}
  legend={props.legend}
  addLabel={props.addLabel}
  component={RepeatableField}
  onAdd={fields => fields.push('')}
  renderField={field => (
    <Field
      component={(props2) => <Timepicker {...props2} timeZone={props.timeZone} />}
      name={field}
    />
  )}
/>;

ListOfTimePicker.propTypes = {
  name: PropTypes.string.isRequired,
  legend: PropTypes.string,
  addLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  timeZone: PropTypes.string,
};

export default ListOfTimePicker;
