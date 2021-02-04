import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Prompt } from 'react-router-dom';

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
import { TemplateEditor } from '@folio/stripes-template-editor';

import tokens from './tokens';
import TokensList from './TokensList';

const NoticeForm = ({ initialValues, onSubmit, onCancel }) => {
  const onMassagedSubmit = (values) => {
    // Take the localizedTemplates and force them back into the shape they need to be for save
    const template = values.localizedTemplates.en
    if (!template.id) {
      template.locality = "en"
    }
    onSubmit({ ...values, localizedTemplates: [template]})
  }

  return (
    <Form onSubmit={onMassagedSubmit} initialValues={initialValues}>
      {({ handleSubmit, pristine, submitting, submitSucceeded }) => (
        <form id="form-patron-notice" noValidate data-test-notice-form onSubmit={handleSubmit}>
          <Paneset isRoot>
            <Pane
              defaultWidth="100%"
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
                    label={<FormattedMessage id="ui-rs.settings.name" />}
                    name="name"
                    required
                    id="input-patron-notice-name"
                    component={TextField}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={3}>
                  <Field
                    label={<FormattedMessage id="ui-rs.settings.notices.active" />}
                    name="active"
                    id="input-patron-notice-active"
                    component={Checkbox}
                    defaultChecked={initialValues?.active}
                  />
                </Col>
              </Row>
              <br />
              <Row>
                <Col xs={8}>
                  <Field
                    label={<FormattedMessage id="ui-rs.settings.notices.description" />}
                    name="description"
                    id="input-patron-notice-description"
                    component={TextArea}
                  />
                </Col>
              </Row>
              <AccordionSet>
                <Accordion
                  id="email-template"
                  label={<FormattedMessage id="ui-rs.settings.notices.email" />}
                >
                  <Row>
                    <Col xs={8}>
                      <Field
                        id="input-patron-notice-subject"
                        component={TextField}
                        required
                        label={<FormattedMessage id="ui-rs.settings.notices.subject" />}
                        name="localizedTemplates.en.template.header"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={8}>
                      <Field
                        label={<FormattedMessage id="ui-rs.settings.notices.body" />}
                        required
                        name="localizedTemplates.en.template.templateBody"
                        id="input-email-template-body"
                        component={TemplateEditor}
                        tokens={tokens}
                        tokensList={TokensList}
                        previewModalHeader={
                          <FormattedMessage id="ui-rs.settings.notices.previewHeader" />
                        }
                      />
                    </Col>
                  </Row>
                </Accordion>
              </AccordionSet>
            </Pane>
          </Paneset>
          <FormattedMessage id="ui-rs.confirmDirtyNavigate">
            {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt} />}
          </FormattedMessage>
        </form>
      )}
    </Form>
  );
};

NoticeForm.propTypes = {
  initialValues: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
};

export default NoticeForm;
