import React from 'react';
import { Form, Field } from 'react-final-form';
import { injectIntl, FormattedMessage } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { RefdataButtons, useIsActionPending } from '@reshare/stripes-reshare';
import { Button, Col, Layout, Modal, ModalFooter, Row, TextArea } from '@folio/stripes/components';
import { required } from '@folio/stripes/util';
import { CancelModalButton } from '../ModalButtons';
import { useModal } from '../MessageModalState';

import { REFDATA_ENDPOINT } from '../../constants/endpoints';

const ActionReasonModal = props => {
  const { action, request, performAction, reasonVocab, resources: { refdatavalues } } = props;
  const [currentModal, setModal] = useModal();
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
  const listOfReasons = refdatavalues ? refdatavalues.records.filter(obj => obj.desc === reasonVocab).map(obj => obj.values)[0] : [];

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id={`ui-rs.actions.${action}`} />}
            open={currentModal === action}
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

ActionReasonModal.manifest = {
  refdatavalues: {
    type: 'okapi',
    path: REFDATA_ENDPOINT,
    params: {
      max: '500',
    },
  }
};

export default stripesConnect(injectIntl(ActionReasonModal));
