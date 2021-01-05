import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { AccordionSet, Accordion, Col, Row, Datepicker, Select, TextField } from '@folio/stripes/components';
import { required } from '@folio/stripes/util';

const PatronRequestForm = () => (
  <AccordionSet>
    <Accordion label={<FormattedMessage id="ui-rs.information.heading.request" />}>
      <Row>
        <Col xs={3}>
          <FormattedMessage id="ui-rs.information.hrid">
            {(placeholder) => (
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
            {(placeholder) => (
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
            {(placeholder) => (
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
            {(placeholder) => (
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
            {(placeholder) => (
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
            {(placeholder) => (
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
            {(placeholder) => (
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
    </Accordion>
    <Accordion label={<FormattedMessage id="ui-rs.information.heading.requestedItem" />}>
      <Row>
        <Col xs={12}>
          <FormattedMessage id="ui-rs.information.title">
            {(placeholder) => (
              <Field
                id="edit-patron-request-title"
                name="title"
                label={placeholder}
                component={TextField}
                placeholder={placeholder}
                required
                validate={required}
              />
            )}
          </FormattedMessage>
        </Col>
      </Row>
      <Row>
        <Col xs={3}>
          <FormattedMessage id="ui-rs.information.date">
            {(placeholder) => (
              <Field
                id="edit-patron-request-publicationDate"
                name="publicationDate"
                label={placeholder}
                component={TextField}
                placeholder={placeholder}
                required
                validate={required}
              />
            )}
          </FormattedMessage>
        </Col>
        <Col xs={9}>
          <FormattedMessage id="ui-rs.information.author">
            {(placeholder) => (
              <Field
                id="edit-patron-request-author"
                name="author"
                label={placeholder}
                component={TextField}
                placeholder={placeholder}
                required
                validate={required}
              />
            )}
          </FormattedMessage>
        </Col>
      </Row>
    </Accordion>
  </AccordionSet>
);

export default PatronRequestForm;
