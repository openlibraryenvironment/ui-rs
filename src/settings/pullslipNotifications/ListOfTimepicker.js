import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { RepeatableField, Timepicker } from '@folio/stripes/components';

// eslint-disable-next-line camelcase, no-unused-vars
const unused__TextboxOfTypeNumber = (p2) => {
  const input = { ...p2.input, value: (p2.input.value || '').replace(/:.*/, '') };
  return <input type="number" size="3" min="0" max="23" pattern="[0-9]*" {...input} />;
};

const ListOfTimepicker = (props) => <FieldArray
  name={props.name}
  legend={props.legend}
  addLabel={props.addLabel}
  component={RepeatableField}
  onAdd={fields => fields.push('')}
  hasMargin={false}
  renderField={field => (
    <Field
      component={(props2) => <Timepicker {...props2} timeZone={props.timeZone} />}
      name={field}
    />
  )}
/>;

ListOfTimepicker.propTypes = {
  name: PropTypes.string.isRequired,
  legend: PropTypes.string,
  addLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  timeZone: PropTypes.string,
};

export default ListOfTimepicker;
