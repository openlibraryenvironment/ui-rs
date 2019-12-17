import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { Button, Layout, Modal, ModalFooter, RadioButton } from '@folio/stripes/components';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const CannotSupply = ({ request, performAction }) => {
  const [currentModal, setModal] = useModal();

  const onSubmit = values => {
    return performAction(
      'supplierCannotSupply',
      values,
      'ui-rs.actions.cannotSupply.success',
      'ui-rs.actions.cannotSupply.error',
    )
      .then(() => setModal(null))
      // Currently displaying errors with this via the route-level MessageBanner rather than within the modal
      .catch(() => setModal(null));
  };

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id="ui-rs.actions.cannotSupply" />
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
            label={<FormattedMessage id="ui-rs.actions.cannotSupply" />}
            open={currentModal === 'CannotSupply'}
            footer={<Footer disableSubmit={submitting || pristine} submit={form.submit} />}
          >
            <SafeHTMLMessage id="ui-rs.actions.cannotSupply.confirm" values={{ id: request.id, item: request.title }} />
            <Layout className="padding-top-gutter">
              <strong><FormattedMessage id="ui-rs.actions.cannotSupply.reason" /></strong>
            </Layout>
            {['unavailable', 'missing', 'incorrect', 'other'].map(reason => (
              <Field
                name="reason"
                component={RadioButton}
                type="radio"
                label={<FormattedMessage id={`ui-rs.actions.cannotSupply.reasons.${reason}`} />}
                key={reason}
                value={reason}
              />
            ))}
          </Modal>
        </form>
      )}
    />
  );
};

CannotSupply.propTypes = {
  request: PropTypes.object.isRequired,
  performAction: PropTypes.func.isRequired,
};

export default CannotSupply;
