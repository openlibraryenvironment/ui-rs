import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { RepeatableField, Select } from '@folio/stripes/components';

const ListOfLocation = (props) => <FieldArray
  name={props.name}
  legend={props.legend}
  addLabel={props.addLabel}
  component={RepeatableField}
  onAdd={fields => fields.push('')}
  renderField={field => (
    <Field
      name={field}
      component={Select}
      dataOptions={props.lmsLocations}
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
  lmsLocations: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default ListOfLocation;
