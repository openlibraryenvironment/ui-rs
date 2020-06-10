import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { RepeatableField, TextField } from '@folio/stripes/components';

const ListOfLocation = (props) => <FieldArray
  name={props.name}
  legend={props.legend}
  addLabel={props.addLabel}
  component={RepeatableField}
  onAdd={fields => fields.push('')}
  renderField={field => (
    <Field
      component={TextField}
      name={field}
    />
  )}
/>;

ListOfLocation.propTypes = {
  name: PropTypes.string.isRequired,
  legend: PropTypes.string,
  addLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

export default ListOfLocation;
