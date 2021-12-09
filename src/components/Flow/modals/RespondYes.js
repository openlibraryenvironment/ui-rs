import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';
import { Button, Modal, ModalFooter, Row, Col, TextArea } from '@folio/stripes/components';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';
import { required as requiredValidator } from '../../../util/validators';

const RespondYes = ({ performAction }) => {
  const [currentModal, setModal] = useModal();

  const onSubmit = values => {
    return performAction('respondYes', values, {
      success: 'ui-rs.actions.respondYes.success',
      error: 'ui-rs.actions.respondYes.error',
    })
      .then(() => setModal(null));
  };

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id="ui-rs.actions.respondYes" />
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
      render={({ handleSubmit, invalid, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="ui-rs.actions.respondYes" />}
            open={currentModal === 'RespondYes'}
            footer={<Footer disableSubmit={invalid || pristine || submitting} submit={form.submit} />}
          >
            <form onSubmit={handleSubmit}>
              <SafeHTMLMessage id="ui-rs.actions.respondYes.callNumber" />
              <Row>
                <Col xs={11}>
                  <Field
                    autoFocus
                    component={TextArea}
                    name="callnumber"
                    required
                    validate={requiredValidator}
                  />
                </Col>
              </Row>
              <SafeHTMLMessage id="ui-rs.actions.respondYes.pickLocation" />
              <Row>
                <Col xs={11}>
                  <Field
                    component={TextArea}
                    name="pickLocation"
                    required
                    validate={requiredValidator}
                  />
                </Col>
              </Row>
              <SafeHTMLMessage id="ui-rs.actions.respondYes.pickShelvingLocation" />
              <Row>
                <Col xs={11}>
                  <Field
                    component={TextArea}
                    name="pickShelvingLocation"
                    required
                    validate={requiredValidator}
                  />
                </Col>
              </Row>
              <SafeHTMLMessage id="ui-rs.actions.addNote" />
              <Row>
                <Col xs={11}>
                  <Field
                    component={TextArea}
                    name="note"
                  />
                </Col>
              </Row>
            </form>
          </Modal>
        </form>
      )}
    />
  );
};

RespondYes.propTypes = {
  performAction: PropTypes.func.isRequired,
};

export default RespondYes;
