import React from 'react';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { useRefdata } from '@k-int/stripes-kint-components';
import { RefdataButtons, useIsActionPending } from '@projectreshare/stripes-reshare';
import { Button, Col, Layout, Modal, ModalFooter, Row, TextArea } from '@folio/stripes/components';
import { required } from '@folio/stripes/util';

import { CancelModalButton } from '../ModalButtons';
import { useModal } from '../MessageModalState';

import { REFDATA_ENDPOINT } from '../../constants/endpoints';

const ActionReasonModal = props => {
  const { action, request, performAction, reasonVocab } = props;
  const [currentModal, setModal] = useModal();
  const isOpen = currentModal === action;
  const refdatavalues = useRefdata({
    desc: reasonVocab,
    endpoint: REFDATA_ENDPOINT,
    queryParams: {
      // TODO: ditch controlledvocab so we can invalidate this in settings and make this waaaay longer
      staleTime: 2 * 60 * 1000,
      enabled: isOpen,
    }
  });
  const closeModal = () => setModal(null);
  const actionPending = !!useIsActionPending(request.id);

  const onSubmit = values => {
    return performAction(action, values, {
      success: `ui-rs.actions.${action}.success`,
      error: `ui-rs.actions.${action}.error`,
    })
      .then(closeModal);
  };

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id={`ui-rs.actions.${action}`} />
      </Button>
      <CancelModalButton><FormattedMessage id="ui-rs.button.goBack" /></CancelModalButton>
    </ModalFooter>
  );
  const listOfReasons = refdatavalues?.length > 0 ? refdatavalues.filter(obj => obj.desc === reasonVocab).map(obj => obj.values)?.[0] : [];

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id={`ui-rs.actions.${action}`} />}
            open={isOpen}
            onClose={closeModal}
            dismissible
            footer={<Footer disableSubmit={submitting || pristine || actionPending} submit={form.submit} />}
          >
            <FormattedMessage id={`ui-rs.actions.${action}.confirm`} values={{ id: request.id, item: request.title }} />
            <Layout className="padding-top-gutter">
              <strong><FormattedMessage id={`ui-rs.actions.${action}.reason`} /></strong>
            </Layout>
            <Row>
              <Col>
                <Field
                  name="reason"
                  component={RefdataButtons}
                  dataOptions={listOfReasons}
                  maxCols={1}
                  required
                  validate={required}
                />
              </Col>
            </Row>
            <Layout className="padding-top-gutter">
              <strong><FormattedMessage id="ui-rs.actions.addNote" /></strong>
            </Layout>
            <Row>
              <Col xs={11}>
                <Field name="note" component={TextArea} autoFocus />
              </Col>
            </Row>
          </Modal>
        </form>
      )}
    />
  );
};

export default ActionReasonModal;
