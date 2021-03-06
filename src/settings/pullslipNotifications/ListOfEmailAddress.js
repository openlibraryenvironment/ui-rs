import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { RepeatableField, TextField } from '@folio/stripes/components';

const TextboxOfTypeEmail = (p2) => <TextField {...p2} type="email" />;

const ListOfEmailAddress = (props) => <FieldArray
  name={props.name}
  legend={props.legend}
  addLabel={props.addLabel}
  component={RepeatableField}
  onAdd={fields => fields.push('')}
  hasMargin={false}
  renderField={field => (
    <Field
      component={TextboxOfTypeEmail}
      name={field}
    />
  )}
/>;

ListOfEmailAddress.propTypes = {
  name: PropTypes.string.isRequired,
  legend: PropTypes.string,
  addLabel: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
};

export default ListOfEmailAddress;
