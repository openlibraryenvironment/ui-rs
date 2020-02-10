import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Accordion,
  Col,
  Datepicker,
  Row,
  TextField,
} from '@folio/stripes/components';

class RequestMetadataForm extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.request" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <Col xs={3}>
              <FormattedMessage id="ui-rs.information.hrid">
                {placeholder => (
                  <Field
                    id="edit-request-metadata-hrid"
                    name="hrid"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={9}>
              <FormattedMessage id="ui-rs.information.fullId">
                {placeholder => (
                  <Field
                    id="edit-request-metadata-fullId"
                    name="id"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    disabled
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormattedMessage id="ui-rs.information.requestingUser">
                {placeholder => (
                  <Field
                    id="edit-request-metadata-requestingUser"
                    name="patronIdentifier"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={3}>
              <FormattedMessage id="ui-rs.information.dateSubmitted">
                {placeholder => (
                  <Field
                    id="edit-request-metadata-dateSubmitted"
                    name="formattedDateCreated"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    disabled
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={3}>
              <FormattedMessage id="ui-rs.information.dateNeeded">
                {placeholder => (
                  <Field
                    id="edit-request-metadata-neededBy"
                    name="neededBy"
                    dateFormat="YYYY-MM-DD"
                    backendDateStandard="YYYY-MM-DD"
                    label={placeholder}
                    component={Datepicker}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <FormattedMessage id="ui-rs.information.pickupLocation">
                {placeholder => (
                  <Field
                    id="edit-request-metadata-pickupLocation"
                    name="pickupLocation"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={6}>
              <FormattedMessage id="ui-rs.information.notes">
                {placeholder => (
                  <Field
                    id="edit-request-metadata-patronNote"
                    name="patronNote"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
        </React.Fragment>
      </Accordion>
    );
  }
}

export default RequestMetadataForm;
