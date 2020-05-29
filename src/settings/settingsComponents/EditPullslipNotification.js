import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { stripesConnect } from '@folio/stripes/core';
import { Pane } from '@folio/stripes/components';
import raw2userData from './raw2userData';


class EditPullslipNotification extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      timer: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.object.isRequired,
        ),
      }),
    }).isRequired,
    mutator: PropTypes.shape({
      timer: PropTypes.shape({
        PUT: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static manifest = {
    timer: {
      type: 'okapi',
      path: 'rs/timers/:{id}',
    },
  };

  onSubmit(values, maybeForm, completeFn) {
    console.log('submit: values =', values);
    console.log('submit: maybeForm =', maybeForm);
    console.log('submit: completeFn =', completeFn);
  }

  validate(values) {
    console.log('validate: values =', values);
  }

  render() {
    const { timer } = this.props.resources;
    if (!timer || !timer.hasLoaded) return null;
    const record = raw2userData(timer.records[0]);

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
