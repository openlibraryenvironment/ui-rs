import React from 'react';
import { Form, Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Modal, ModalFooter, Select } from '@folio/stripes/components';
import { useIsActionPending, useOkapiQuery } from '@reshare/stripes-reshare';
import { required } from '../../../util/validators';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const Footer = ({ disableSubmit, submit }) => (
  <ModalFooter>
    {/* These appear in the reverse order? */}
    <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
      <FormattedMessage id="ui-rs.actions.manualClose" />
    </Button>
    <CancelModalButton><FormattedMessage id="ui-rs.button.goBack" /></CancelModalButton>
  </ModalFooter>
);

const ManualClose = ({ request, performAction }) => {
  const actionPending = !!useIsActionPending(request.id);
  const [currentModal, setModal] = useModal();
  const closeModal = () => setModal(null);
  const { formatMessage } = useIntl();

    const terminalQuery = useOkapiQuery('rs/patronrequests/' + request.id + '/manualCloseStates', {
    staleTime: 8 * 60 * 1000
  });
  if (!terminalQuery.isSuccess) return null;
  const terminalOptions = terminalQuery.data
    .map(state => ({ value: state.code, label: formatMessage({ id: `stripes-reshare.states.${state.code}` }) }));

  const onSubmit = values => {
    return performAction('manualClose', values, {
      success: 'ui-rs.actions.manualClose.success',
      error: 'ui-rs.actions.manualClose.error',
    })
      .then(closeModal);
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={{
          terminalState: terminalOptions[0].value
      }}
      render={({ handleSubmit, submitting, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="ui-rs.actions.manualClose" />}
            open={currentModal === 'ManualClose'}
            onClose={closeModal}
            dismissible
            footer={<Footer disableSubmit={submitting || actionPending} submit={form.submit} />}
          >
            <p>
              <FormattedMessage id="ui-rs.actions.manualClose.confirm" values={{ hrid: request.hrid }} />
            </p>
            <p>
              <FormattedMessage id="ui-rs.actions.manualClose.detail" />
            </p>
            <Field
              name="terminalState"
              label={<FormattedMessage id="ui-rs.actions.manualClose.choose" />}
              component={Select}
              dataOptions={terminalOptions}
              required
              validate={required}
            />
          </Modal>
        </form>
      )}
    />
  );
};

export default ManualClose;
