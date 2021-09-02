import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { AccordionSet, Accordion, Col, Row, Datepicker, Select, TextArea, TextField } from '@folio/stripes/components';
import { required } from '@folio/stripes/util';
import { Pluggable, withStripes } from '@folio/stripes/core';

const PatronRequestForm = ({ locations, requesters, onSISelect, stripes }) => (
  <AccordionSet>
    <Accordion label={<FormattedMessage id="ui-rs.information.heading.request" />}>
      <Row>
        <Col xs={3}>
          <Field
            id="edit-request-metadata-requestingUser"
            name="patronIdentifier"
            label={<FormattedMessage id="ui-rs.information.requestingUser" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
        <Col xs={3}>
          <Field
            id="edit-request-metadata-neededBy"
            name="neededBy"
            dateFormat="YYYY-MM-DD"
            backendDateStandard="YYYY-MM-DD"
            label={<FormattedMessage id="ui-rs.information.dateNeeded" />}
            component={Datepicker}
          />
        </Col>
        <Col xs={3}>
          <Field
            id="edit-request-metadata-pickupLocation"
            name="pickupLocationSlug"
            label={<FormattedMessage id="ui-rs.information.pickupLocation" />}
            placeholder=" "
            component={Select}
            dataOptions={locations}
            required
            validate={required}
          />
        </Col>
        <Col xs={3}>
          <Field
            id="edit-request-metadata-volume"
            name="volume"
            label={<FormattedMessage id="ui-rs.information.volume" />}
            component={TextField}
          />
        </Col>
      </Row>
      {requesters.length > 1 && (
        <Row>
          <Col xs={3}>
            <Field
              id="edit-request-metadata-requestingInstitution"
              name="requestingInstitutionSymbol"
              label={<FormattedMessage id="ui-rs.information.requestingInstitution" />}
              placeholder=" "
              component={Select}
              dataOptions={requesters}
              required
              validate={required}
            />
          </Col>
        </Row>
      )}
      <Row>
        <Col xs={9}>
          <Field
            id="edit-request-metadata-patronNote"
            name="patronNote"
            label={<FormattedMessage id="ui-rs.information.notes" />}
            component={TextArea}
            rows={5}
          />
        </Col>
      </Row>
    </Accordion>
    <Accordion
      label={<FormattedMessage id="ui-rs.information.heading.requestedTitle" />}
      displayWhenOpen={<Pluggable
        type={`rs-siquery-${stripes.config?.reshare?.sharedIndex?.type}`}
        endpoint={stripes.config?.reshare?.sharedIndex?.query}
        searchButtonStyle="primary marginBottom0"
        searchLabel="Populate from shared index"
        selectInstance={onSISelect}
      />}
    >
      <Row>
        <Col xs={4}>
          <Field
            id="edit-patron-request-systemInstanceIdentifier"
            name="systemInstanceIdentifier"
            label={<FormattedMessage id="ui-rs.information.systemInstanceIdentifier" />}
            component={TextField}
            validate={required}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field
            id="edit-patron-request-title"
            name="title"
            label={<FormattedMessage id="ui-rs.information.title" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
        <Col xs={4}>
          <Field
            id="edit-patron-request-author"
            name="author"
            label={<FormattedMessage id="ui-rs.information.author" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
        <Col xs={4}>
          <Field
            id="edit-patron-request-publicationDate"
            name="publicationDate"
            label={<FormattedMessage id="ui-rs.information.date" />}
            component={TextField}
            validate={required}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field
            id="edit-patron-request-publisher"
            name="publisher"
            label={<FormattedMessage id="ui-rs.information.publisher" />}
            component={TextField}
          />
        </Col>
        <Col xs={4}>
          <Field
            id="edit-patron-request-edition"
            name="edition"
            label={<FormattedMessage id="ui-rs.information.edition" />}
            component={TextField}
          />
        </Col>
        <Col xs={4}>
          <Field
            id="edit-patron-request-placeOfPublication"
            name="placeOfPublication"
            label={<FormattedMessage id="ui-rs.information.placeOfPublication" />}
            component={TextField}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <Field
            id="edit-patron-request-isbn"
            name="isbn"
            label={<FormattedMessage id="ui-rs.information.isbn" />}
            component={TextField}
          />
        </Col>
        <Col xs={4}>
          <Field
            id="edit-patron-request-issn"
            name="issn"
            label={<FormattedMessage id="ui-rs.information.issn" />}
            component={TextField}
          />
        </Col>
        <Col xs={4}>
          <Field
            id="edit-patron-request-oclcNumber"
            name="oclcNumber"
            label={<FormattedMessage id="ui-rs.information.oclcNumber" />}
            component={TextField}
          />
        </Col>
      </Row>
    </Accordion>
  </AccordionSet>
);

export default withStripes(PatronRequestForm);
