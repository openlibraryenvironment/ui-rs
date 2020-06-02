import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { stripesConnect } from '@folio/stripes/core';
import { Pane, Card, Button } from '@folio/stripes/components';
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
    console.log('onSubmit: values =', values);
    return this.props.mutator.editTimer.PUT(user2rawData(values));
  }

  headerEnd(record, handleSubmit) {
    return (
      <>
        <Button bottomMargin0 buttonStyle="primary" onClick={handleSubmit}>Save</Button>
        <Button bottomMargin0 onClick={() => this.props.history.push(`../${record.id}`)}>Cancel</Button>
      </>
    );
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
            <Card
              id="edit-pullslip-notification"
              headerStart={record.name}
              headerEnd={this.headerEnd(record, handleSubmit)}
            >
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name</label>
                  <Field id="name" name="name" component="input" placeholder="Name of report" />
                </div>
              </form>
            </Card>
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
