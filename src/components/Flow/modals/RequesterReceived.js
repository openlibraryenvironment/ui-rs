import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { Button, Layout, Modal, ModalFooter, TextArea } from '@folio/stripes/components';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const RequesterReceived = ({ request, performAction }) => {
  const [currentModal, setModal] = useModal();

  const onSubmit = values => {
    return performAction(
      'requesterReceived',
      values,
      'ui-rs.actions.markReceived.success',
      'ui-rs.actions.markReceived.error',
    )
      .then(() => setModal(null))
      // Currently displaying errors with this via the route-level MessageBanner rather than within the modal
      .catch(() => setModal(null));
  };

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id="ui-rs.actions.markReceivedWithoutScan" />
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
      render={({ handleSubmit, submitting, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="markReceivedWithoutScan" />}
            open={currentModal === 'RequesterReceived'}
            footer={<Footer disableSubmit={submitting} submit={form.submit} />}
          >
            <SafeHTMLMessage id="ui-rs.actions.markReceivedWithoutScan.confirm" values={{ id: request.id, item: request.title }} />
            <Layout className="padding-top-gutter">
              <strong><FormattedMessage id="ui-rs.actions.markReceivedWithoutScan.note" /></strong>
            </Layout>
            <Field name="note" component={TextArea} autoFocus />
          </Modal>
        </form>
      )}
    />
  );
};

RequesterReceived.propTypes = {
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
};

export default RequesterReceived;
