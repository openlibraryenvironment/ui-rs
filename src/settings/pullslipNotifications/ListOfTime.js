import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { RepeatableField, Timepicker } from '@folio/stripes/components';


class ListOfTime extends React.Component {
  render() {
    return (
      <FieldArray
        addLabel="Add time"
        legend="Times"
        component={RepeatableField}
        name="times"
        onAdd={fields => fields.push('')}
        renderField={field => (
          <Field
            component={(props) => <Timepicker {...props} timeZone="UTC" />}
            name={field}
          />
        )}
      />
    );
  }
}

ListOfTime.propTypes = {
};

export default ListOfTime;
