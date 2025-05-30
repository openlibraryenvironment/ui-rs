import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { Field, useForm, useFormState } from 'react-final-form';
import {
  AccordionSet,
  Accordion,
  Col,
  Row,
  Datepicker,
  Label,
  RadioButton,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { required } from '@folio/stripes/util';
import { Pluggable, useStripes } from '@folio/stripes/core';
import { SERVICE_TYPE_COPY, SERVICE_TYPE_LOAN } from '../../constants/serviceType';

const CREATE = 'create';
const EDIT = 'update';


const PatronRequestForm = ({ copyrightTypes, locations, requesters, onSISelect,
  operation, patronRequest }) => {
  const { change } = useForm();
  const { values } = useFormState();
  const isCopyReq = values?.serviceType?.value === SERVICE_TYPE_COPY;
  const stripes = useStripes();

  useEffect(() => {
    if (locations?.length === 1) {
      change('pickupLocationSlug', locations[0]?.value);
    }
  }, [locations, change]);

  return (

    <AccordionSet>
      <Row>
        <Col xs={4}>
          <Field
            id="edit-request-metadata-requestingUser"
            name="patronIdentifier"
            label={<FormattedMessage id="ui-rs.information.requestingUser" />}
            component={TextField}
            required
            validate={required}
          />
        </Col>
        <Col xs={2}>
          <Field
            id="edit-request-metadata-neededBy"
            name="neededBy"
            dateFormat="YYYY-MM-DD"
            backendDateStandard="YYYY-MM-DD"
            label={<FormattedMessage id="ui-rs.information.dateNeeded" />}
            component={Datepicker}
          />
        </Col>
        <Col xs={4}>
          <Field
            id="edit-request-metadata-pickupLocation"
            name="pickupLocationSlug"
            label={<FormattedMessage id="ui-rs.information.pickupLocation" />}
            placeholder=" "
            component={Select}
            dataOptions={locations}
            required={!isCopyReq}
            validate={!isCopyReq && required}
          />
        </Col>
        <Col xs={2}>
          <Label><FormattedMessage id="ui-rs.information.serviceType" /></Label>
          <Field
            component={RadioButton}
            inline
            label={<FormattedMessage id="ui-rs.information.serviceType.loan" />}
            name="serviceType.value"
            type="radio"
            value={SERVICE_TYPE_LOAN}
          />
          <Field
            component={RadioButton}
            inline
            label={<FormattedMessage id="ui-rs.information.serviceType.copy" />}
            name="serviceType.value"
            type="radio"
            value={SERVICE_TYPE_COPY}
          />
        </Col>
      </Row>
      {requesters.length > 1 && operation !== EDIT && (

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
      { ((patronRequest?.stateModel?.shortcode === 'SLNPRequester' || patronRequest?.stateModel?.shortcode === 'SLNPNonReturnableRequester')
        && operation === EDIT) && (
        <Row>
          <Col xs={3}>
            <Field
              id="edit-request-metadata-requestingInstitution"
              name="requestingInstitutionSymbol"
              label={<FormattedMessage id="ui-rs.information.requestingInstitution" />}
              component={TextField}
              disabled
            />
          </Col>
        </Row>
      )

      }
      <Row>
        <Col xs={5}>
          <Field
            id="edit-request-metadata-patronNote"
            name="patronNote"
            label={<FormattedMessage id="ui-rs.information.notes" />}
            component={TextArea}
            rows={5}
            maxLength={255}
          />
        </Col>
        <Col xs={5}>
          <Field
            id="edit-request-metadata-localNote"
            name="localNote"
            label={<FormattedMessage id="ui-rs.information.localNote" />}
            component={TextArea}
            rows={5}
          />
        </Col>
        {isCopyReq &&
          <Col xs={2}>
            <Field
              id="edit-request-metadata-copyright-type"
              name="copyrightType.id"
              label={<FormattedMessage id="ui-rs.information.copyrightType" />}
              placeholder=" "
              component={Select}
              dataOptions={copyrightTypes}
              required
              validate={required}
            />
          </Col>
        }
      </Row>
      <Accordion
        label={<FormattedMessage id="ui-rs.information.heading.requestedTitle" />}
        displayWhenOpen={<Pluggable
          type={`rs-siquery-${stripes.config?.reshare?.sharedIndex?.type}`}
          endpoint={stripes.config?.reshare?.sharedIndex?.query}
          searchButtonStyle="primary marginBottom0"
          searchLabel={<FormattedMessage id="ui-rs.requestform.populateFromSI" />}
          selectInstance={onSISelect}
        />}
      >
        <Row>
          <Col xs={8}>
            <Field
              id="edit-patron-request-systemInstanceIdentifier"
              name="systemInstanceIdentifier"
              label={<FormattedMessage id="ui-rs.information.systemInstanceIdentifier" />}
              component={TextField}
              endControl={
                // The padding on endControl the necessitates this margin when using Button rather than IconButton
                // will be removed soon, perhaps Quesnelia
                <span style={{ marginRight: '-6px' }}>
                  <Pluggable
                    type={`rs-siquery-${stripes.config?.reshare?.sharedIndex?.type}`}
                    endpoint={stripes.config?.reshare?.sharedIndex?.query}
                    searchButtonStyle="noRadius primary marginBottom0"
                    searchLabel={<FormattedMessage id="ui-rs.requestform.populateById" />}
                    selectInstance={onSISelect}
                    specifiedId={values?.systemInstanceIdentifier}
                    disabled={!values?.systemInstanceIdentifier}
                  />
                </span>
              }
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
              id="edit-patron-request-subtitle"
              name="subtitle"
              label={<FormattedMessage id="ui-rs.information.subtitle" />}
              component={TextField}
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
      <Accordion label={<FormattedMessage id="ui-rs.information.heading.partDetails" />}>
        <Row>
          <Col xs={4}>
            <Field
              id="edit-patron-request-title-of-component"
              name="titleOfComponent"
              label={<FormattedMessage id="ui-rs.information.titleOfComponent" />}
              component={TextField}
            />
          </Col>
          <Col xs={4}>
            <Field
              id="edit-patron-request-author-of-component"
              name="authorOfComponent"
              label={<FormattedMessage id="ui-rs.information.authorOfComponent" />}
              component={TextField}
            />
          </Col>
          <Col xs={4}>
            <Field
              id="edit-request-metadata-volume"
              name="volume"
              label={<FormattedMessage id="ui-rs.information.volume" />}
              component={TextField}
            />
          </Col>
          <Col xs={4}>
            <Field
              id="edit-patron-request-issue"
              name="issue"
              label={<FormattedMessage id="ui-rs.information.issue" />}
              component={TextField}
            />
          </Col>
          <Col xs={4}>
            <Field
              id="edit-patron-request-pages"
              name="pagesRequested"
              label={<FormattedMessage id="ui-rs.information.pages" />}
              component={TextField}
            />
          </Col>
        </Row>
      </Accordion>
      <Accordion label={<FormattedMessage id="ui-rs.information.heading.publicationDetails" />}>
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
              id="edit-patron-request-publicationDate"
              name="publicationDate"
              label={<FormattedMessage id="ui-rs.information.date" />}
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
          <Col xs={4}>
            <Field
              id="edit-patron-request-edition"
              name="edition"
              label={<FormattedMessage id="ui-rs.information.edition" />}
              component={TextField}
            />
          </Col>
        </Row>
      </Accordion>
    </AccordionSet>
  );
};

export default PatronRequestForm;
