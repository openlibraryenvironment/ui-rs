import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { stripesConnect } from '@folio/stripes/core';
import { Button, Col, Layout, Modal, ModalFooter, RadioButton, RadioButtonGroup, Row, TextArea } from '@folio/stripes/components';
import { required } from '@folio/stripes-util';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const RespondToCancel = props => {
  const { request, performAction } = props;
  const [currentModal, setModal] = useModal();

  const onSubmit = values => {
    return performAction(
      'supplierRespondToCancel',
      values,
      'ui-rs.actions.respondToCancel.success',
      'ui-rs.actions.respondToCancel.error',
    )
      .then(() => setModal(null))
      // Currently displaying errors with this via the route-level MessageBanner rather than within the modal
      .catch(() => setModal(null));
  };

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id="ui-rs.actions.respondToCancel" />
      </Button>
      <CancelModalButton><FormattedMessage id="ui-rs.button.goBack" /></CancelModalButton>
    </ModalFooter>
  );
  Footer.propTypes = {
    disableSubmit: PropTypes.bool,
    submit: PropTypes.func.isRequired,
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="ui-rs.actions.respondToCancel" />}
            open={currentModal === 'RespondToCancel'}
            footer={<Footer disableSubmit={submitting || pristine} submit={form.submit} />}
          >
            <SafeHTMLMessage id="ui-rs.actions.respondToCancel.confirm" values={{ id: request.id, item: request.title }} />
            <Row>
              <Col xs={6}>
                <Layout className="padding-top-gutter">
                  <strong><SafeHTMLMessage id="ui-rs.actions.respondToCancel.cancelResponse" /></strong>
                </Layout>
                <Field
                  name="cancelResponse"
                  component={RadioButtonGroup}
                  required
                  validate={required}
                >
                  <RadioButton
                    label={<FormattedMessage id="ui-rs.actions.respondToCancel.yes" />}
                    value="yes"
                    key="yes"
                  />
                  <RadioButton
                    label={<FormattedMessage id="ui-rs.actions.respondToCancel.no" />}
                    value="no"
                    key="no"
                  />
                </Field>
              </Col>
              <Col xs={6}>
                <Layout className="padding-top-gutter">
                  <strong><SafeHTMLMessage id="ui-rs.actions.respondToCancel.note" /></strong>
                </Layout>
                <Field
                  name="note"
                  component={TextArea}
                />
              </Col>
            </Row>
          </Modal>
        </form>
      )}
    />
  );
};

RespondToCancel.manifest = {
  refdatavalues: {
    type: 'okapi',
    path: 'rs/refdata',
    params: {
      max: '500',
    },
  }
};

RespondToCancel.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired
  }),
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
  resources: PropTypes.shape({
    refdatavalues: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        desc: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          value: PropTypes.string,
          label: PropTypes.string,
        })),
      })),
    }),
  })
};

export default stripesConnect(injectIntl(RespondToCancel));
