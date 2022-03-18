import React from 'react';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router-dom';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

import { useRefdata, useTemplates } from '@k-int/stripes-kint-components';

import { required } from '@folio/stripes/util';
import {
  Accordion,
  AccordionSet,
  Button,
  Checkbox,
  Col,
  IconButton,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import NoticeFieldArray from './NoticeFieldArray';
import { REFDATA_ENDPOINT, TEMPLATES_ENDPOINT } from '../../constants/endpoints';

// Takes the refdata as it comes back from stripes-connect and teases out an
// object to feed to a select control eg. the value property is set to the id.
const selectifyRefdata = (refdataRecords) => (
  refdataRecords
    .map(obj => (
      obj.values.map(entry => ({ label: entry.label, value: entry.id }))
    ))[0]
);

const NoticePolicyForm = ({ initialValues, onSubmit, onCancel }) => {
  const options = {};

  const triggersRefdata = selectifyRefdata(useRefdata({
    desc: 'noticeTriggers',
    endpoint: REFDATA_ENDPOINT
  }));

  const formatsRefdata = selectifyRefdata(useRefdata({
    desc: 'noticeFormats',
    endpoint: REFDATA_ENDPOINT
  }));

  const templates = useTemplates({
    context: 'noticeTemplate',
    endpoint: TEMPLATES_ENDPOINT,
    sort: 'id'
  });

  options.templates = templates.map(template => ({ value: template.id, label: template.name }));
  options.triggers = triggersRefdata;
  options.formats = formatsRefdata;

  return (
    <Form onSubmit={onSubmit} initialValues={initialValues} mutators={{ ...arrayMutators }}>
      {({ handleSubmit, pristine, submitting, submitSucceeded }) => (
        <form id="form-patron-notice" noValidate data-test-notice-form onSubmit={handleSubmit}>
          <Paneset isRoot>
            <Pane
              defaultWidth="100%"
              centerContent
              paneTitle={initialValues?.id
                ? initialValues?.name
                : <FormattedMessage id="ui-rs.settings.notices.newLabel" />
            }
              firstMenu={
                <PaneMenu>
                  <FormattedMessage id="ui-rs.closeNewPatronRequest">
                    {ariaLabel => (
                      <IconButton
                        icon="times"
                        id="close-rs-form-button"
                        onClick={onCancel}
                        aria-label={ariaLabel}
                      />
                    )}
                  </FormattedMessage>
                </PaneMenu>
            }
              footer={
                <PaneFooter
                  renderEnd={
                    <Button
                      buttonStyle="primary mega"
                      disabled={pristine || submitting}
                      marginBottom0
                      onClick={handleSubmit}
                      type="submit"
                    >
                      <FormattedMessage id="stripes-components.saveAndClose" />
                    </Button>
                }
                  renderStart={
                    <Button buttonStyle="default mega" marginBottom0 onClick={onCancel}>
                      <FormattedMessage id="stripes-components.cancel" />
                    </Button>
                }
                />
            }
            >
              <Row>
                <Col xs={8} data-test-notice-template-name>
                  <Field
                    label={<FormattedMessage id="ui-rs.settings.noticePolicies.name" />}
                    name="name"
                    required
                    validate={required}
                    id="input-patron-notice-name"
                    component={TextField}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                  <Field
                    label={<FormattedMessage id="ui-rs.settings.noticePolicies.active" />}
                    name="active"
                    id="input-patron-notice-active"
                    component={Checkbox}
                    type="checkbox"
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-rs.settings.noticePolicies.description" />}
                    name="description"
                    id="input-patron-notice-description"
                    component={TextArea}
                  />
                </Col>
              </Row>
              <AccordionSet>
                <Accordion
                  label={<FormattedMessage id="ui-rs.settings.noticePolicies.notices" />}
                >
                  {options?.templates &&
                    <FieldArray
                      component={NoticeFieldArray}
                      name="notices"
                      options={options}
                    />
                  }
                </Accordion>
              </AccordionSet>
            </Pane>
          </Paneset>
          <FormattedMessage id="ui-rs.confirmDirtyNavigate">
            {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt[0]} />}
          </FormattedMessage>
        </form>
      )}
    </Form>
  );
};

export default NoticePolicyForm;
