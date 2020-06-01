import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { stripesConnect } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';
import { raw2userData, user2rawData } from './util';


class EditPullslipNotification extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      editTimer: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.object.isRequired,
        ),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      editTimer: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static manifest = {
    editTimer: {
      type: 'okapi',
      path: 'rs/timers/:{id}',
    },
  };

  validate = (_values) => {
    // Nothing to do at this stage
    // console.log('validate: values =', values);
  }

  onSubmit = (values) => {
    return this.props.mutator.editTimer.PUT(user2rawData(values));
  }

  render() {
    const { editTimer } = this.props.resources;
    if (!editTimer || !editTimer.hasLoaded) return null;
    const record = raw2userData(editTimer.records[0]);

    return (
      <Pane defaultWidth="fill">
        <Form
          onSubmit={this.onSubmit}
          validate={this.validate}
          initialValues={record}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name">Name</label>
                <Field id="name" name="name" component="input" placeholder="Name of report" />
              </div>
              <button type="submit">Submit</button>
            </form>
          )}
        />

        <hr />
        <pre>
          {JSON.stringify(record, null, 2)}
        </pre>
      </Pane>
    );
  }
}

export default stripesConnect(EditPullslipNotification);
