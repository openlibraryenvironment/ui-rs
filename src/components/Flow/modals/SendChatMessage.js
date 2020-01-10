import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { Button, Modal, ModalFooter, Row, Col, TextArea } from '@folio/stripes/components';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const SendChatMessage = ({ request, performAction }) => {
  const [currentModal, setModal] = useModal();

  const onSubmit = values => {
    return (
      performAction(
        'message',
        values,
        'ui-rs.actions.sendChatMessage.success',
        'ui-rs.actions.sendChatMessage.error',
      )
      .then(() => setModal(null))
      // Currently displaying errors with this via the route-level MessageBanner rather than within the modal
      .catch(() => setModal(null))
    );
  }

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id="ui-rs.actions.sendChatMessage" />
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
        <Modal
          label={<FormattedMessage id="ui-rs.actions.sendChatMessage" />}
          open={currentModal === 'SendChatMessage'}
          footer={<Footer disableSubmit={submitting || pristine} submit={form.submit} />}
        >
          <SafeHTMLMessage id="ui-rs.actions.sendChatMessage.confirm" />
          <form onSubmit={handleSubmit}>
            <Row>
              <Col xs={11}>
                <Field name="note" component={TextArea} autoFocus />
              </Col>
            </Row>
          </form>
        </Modal>
      )}
    />
  );
};

SendChatMessage.propTypes = {
  performAction: PropTypes.func.isRequired,
};

export default SendChatMessage;
