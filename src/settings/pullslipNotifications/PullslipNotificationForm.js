import React from 'react';
import PropTypes from 'prop-types';
import { Link, Prompt } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import arrayMutators from 'final-form-arrays';
import { Form, Field } from 'react-final-form';
import { Pane, Card, Button, Row, Col, TextField, Checkbox } from '@folio/stripes/components';
import ListOfTimepicker from './ListOfTimepicker';
import ListOfEmailAddress from './ListOfEmailAddress';
import ListOfLocation from './ListOfLocation';
import DaysOfWeek from './DaysOfWeek';


class EditPullslipNotification extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    lmsLocations: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ).isRequired,
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

  headerEnd(record, handleSubmit, disableSave) {
    const suffix = record.id ? `/${record.id}` : '';
    return (
      <>
        <Button bottomMargin0 buttonStyle="primary" disabled={disableSave} onClick={handleSubmit}>Save</Button>
        <Link to={`/settings/rs/pullslip-notifications${suffix}`}>
          <Button bottomMargin0>Cancel</Button>
        </Link>
      </>
    );
  }

  renderForm() {
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
          <Col xs={4}>
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
          <Col xs={4}>
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
        </Row>
        <Row><Col>&nbsp;</Col></Row>
        <Row>
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
          <Col xs={4}>
            <FormattedMessage id="ui-rs.pullslipNotification.locations">
              {placeholder => (
                <Field
                  name="locations"
                  component={this.ListOfConfiguredLocation}
                  legend={placeholder}
                  placeholder={placeholder}
                  lmsLocations={this.props.lmsLocations}
                />
              )}
            </FormattedMessage>
          </Col>
          <Col xs={4}>
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
    const { record, onSubmit } = this.props;

    return (
      <Pane defaultWidth="fill">
        <Form
          initialValues={record}
          onSubmit={onSubmit}
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
      </Pane>
    );
  }
}

export default EditPullslipNotification;
