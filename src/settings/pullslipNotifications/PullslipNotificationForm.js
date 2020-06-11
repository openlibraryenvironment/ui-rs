import React from 'react';
import PropTypes from 'prop-types';
import { Link, Prompt } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import arrayMutators from 'final-form-arrays';
import { Form, Field } from 'react-final-form';
import { stripesConnect } from '@folio/stripes/core';
import { Pane, Card, Button, Row, Col, TextField, Checkbox, Accordion } from '@folio/stripes/components';
import { raw2userData, user2rawData } from './util';
import ListOfTimepicker from './ListOfTimepicker';
import ListOfEmailAddress from './ListOfEmailAddress';
import ListOfLocation from './ListOfLocation';
import DaysOfWeek from './DaysOfWeek';


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
      lmsLocations: PropTypes.shape({
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
    lmsLocations: {
      type: 'okapi',
      path: 'rs/hostLMSLocations',
      params: {
        perPage: '100',
      }
    },
  };

  constructor(props) {
    super(props);
    this.ListOfConfiguredTimepicker = (props2) => <ListOfTimepicker
      {...props2}
      name="times"
      addLabel={<FormattedMessage id="ui-rs.pullslipNotification.addTime" />}
      timeZone="UTC"
    />;
    this.ListOfConfiguredEmailAddress = (props2) => <ListOfEmailAddress
      {...props2}
      name="emailAddresses"
      addLabel={<FormattedMessage id="ui-rs.pullslipNotification.addEmailAddress" />}
    />;
    this.ListOfConfiguredLocation = (props2) => <ListOfLocation
      {...props2}
      name="locations"
      addLabel={<FormattedMessage id="ui-rs.pullslipNotification.addLocation" />}
    />;
  }

  validate = (_values) => {
    // Nothing to do at this stage
    // console.log('validate: values =', values);
  }

  onSubmit = (values) => {
    return this.props.mutator.editTimer.PUT(user2rawData(values))
      .then(() => this.props.history.push(`/settings/rs/pullslip-notifications/${values.id}`));
  }

  headerEnd(record, handleSubmit, disableSave) {
    return (
      <>
        <Button bottomMargin0 buttonStyle="primary" disabled={disableSave} onClick={handleSubmit}>Save</Button>
        <Link to={`/settings/rs/pullslip-notifications/${record.id}`}>
          <Button bottomMargin0>Cancel</Button>
        </Link>
      </>
    );
  }

  renderForm() {
    const { lmsLocations } = this.props.resources;
    if (!lmsLocations.hasLoaded) return '...';

    return (
      <>
        <Row>
          <Col xs={12}>
            <FormattedMessage id="ui-rs.pullslipNotification.name">
              {placeholder => (
                <Field
                  name="name"
                  component={TextField}
                  label={placeholder}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <FormattedMessage id="ui-rs.pullslipNotification.status">
              {placeholder => (
                <Field
                  name="status"
                  component={Checkbox}
                  type="checkbox"
                  label={placeholder}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={5}>
            <FormattedMessage id="ui-rs.pullslipNotification.days">
              {placeholder => (
                <Field
                  name="days"
                  component={DaysOfWeek}
                  label={placeholder}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={4}>
            <FormattedMessage id="ui-rs.pullslipNotification.times">
              {placeholder => (
                <Field
                  name="times"
                  component={this.ListOfConfiguredTimepicker}
                  legend={placeholder}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <FormattedMessage id="ui-rs.pullslipNotification.locations">
              {placeholder => (
                <Field
                  name="locations"
                  component={this.ListOfConfiguredLocation}
                  legend={placeholder}
                  placeholder={placeholder}
                  lmsLocations={lmsLocations.records}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={6}>
            <FormattedMessage id="ui-rs.pullslipNotification.emailAddresses">
              {placeholder => (
                <Field
                  name="emailAddresses"
                  component={this.ListOfConfiguredEmailAddress}
                  legend={placeholder}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </Col>
        </Row>
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
          mutators={{ ...arrayMutators }}
          render={({ handleSubmit, pristine, submitting, submitSucceeded }) => (
            <Card
              id="edit-pullslip-notification"
              headerStart={record.name}
              headerEnd={this.headerEnd(record, handleSubmit, pristine || submitting)}
            >
              <form onSubmit={handleSubmit}>
                {this.renderForm()}
              </form>
              <FormattedMessage id="ui-rs.confirmDirtyNavigate">
                {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt} />}
              </FormattedMessage>
            </Card>
          )}
        />

        <Accordion closedByDefault label={<FormattedMessage id="ui-rs.information.heading.developer" />}>
          <pre>
            {JSON.stringify(record, null, 2)}
          </pre>
        </Accordion>
      </Pane>
    );
  }
}

export default stripesConnect(EditPullslipNotification);
