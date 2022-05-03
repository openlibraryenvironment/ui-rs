import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { Button, Modal, ModalFooter, Row, Col, Select, TextArea } from '@folio/stripes/components';
import { useOkapiQuery } from '@reshare/stripes-reshare';

import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';
import { required as requiredValidator } from '../../../util/validators';

const compareLabel = (a, b) => (a.label > b.label ? 1 : a.label < b.label ? -1 : 0);

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

const RespondYes = ({ performAction }) => {
  const [currentModal, setModal] = useModal();
  const closeModal = () => setModal(null);

  const locQuery = useOkapiQuery('rs/hostLMSLocations', { searchParams: { perPage: '1000' }, staleTime: 30 * 60 * 1000 });
  const shelvingQuery = useOkapiQuery('rs/shelvingLocations', { searchParams: { perPage: '1000' }, staleTime: 30 * 60 * 1000 });
  if (![locQuery, shelvingQuery].every(x => x?.isSuccess)) return null;
  const locOptions = locQuery.data
    .filter(x => x.supplyPreference >= 0)
    .map(x => ({ label: x.name, value: x.name }))
    .sort(compareLabel);
  const shelvingOptions = shelvingQuery.data
    .filter(x => x.supplyPreference >= 0)
    .map(x => ({ label: x.name, value: x.name }))
    .sort(compareLabel);

  const onSubmit = values => {
    return performAction('respondYes', values, {
      success: 'ui-rs.actions.respondYes.success',
      error: 'ui-rs.actions.respondYes.error',
    })
      .then(closeModal);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, invalid, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="ui-rs.actions.respondYes" />}
            open={currentModal === 'RespondYes'}
            onClose={closeModal}
            dismissible
            footer={<Footer disableSubmit={invalid || pristine || submitting} submit={form.submit} />}
          >
            <form onSubmit={handleSubmit}>
              <FormattedMessage id="ui-rs.actions.respondYes.callNumber" />
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
              <FormattedMessage id="ui-rs.actions.respondYes.pickLocation" />
              <Row>
                <Col xs={11}>
                  <Field
                    component={Select}
                    dataOptions={[{ label: '', value: '' }, ...locOptions]}
                    name="pickLocation"
                    required
                    validate={requiredValidator}
                  />
                </Col>
              </Row>
              {shelvingOptions.length > 0 &&
                <>
                  <FormattedMessage id="ui-rs.actions.respondYes.pickShelvingLocation" />
                  <Row>
                    <Col xs={11}>
                      <Field
                        component={Select}
                        dataOptions={[{ label: '', value: '' }, ...shelvingOptions]}
                        name="pickShelvingLocation"
                        required
                        validate={requiredValidator}
                      />
                    </Col>
                  </Row>
                </>
              }
              <FormattedMessage id="ui-rs.actions.addNote" />
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
