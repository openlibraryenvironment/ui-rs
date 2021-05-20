import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FieldArray, arrayMutators } from 'react-final-form-arrays';

import { FormattedMessage } from 'react-intl';
import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import { Button, Modal, ModalFooter } from '@folio/stripes/components';
import { required } from '@folio/stripes/util';
import { ActionContext } from '../ActionContext';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const FillMultiVolumeRequest = ({ request, performAction }) => {
  const [actions] = useContext(ActionContext);
  const [currentModal, setModal] = useModal();

  console.log("Current modal: %o", currentModal)

  const onSubmit = values => {
    return performAction(
      'supplierCheckInToReshare',
      values,
      'ui-rs.actions.fillMultiVolumeRequest.success',
      'ui-rs.actions.fillMultiVolumeRequest.error',
    )
      .then(() => setModal(null))
      .catch(() => setModal(null));
  };

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest" />
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
      mutators={{
        ...arrayMutators,
      }}
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting, pristine, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest" />}
            open={currentModal === 'FillMultiVolumeRequest'}
            footer={<Footer disableSubmit={submitting || pristine || actions.pending} submit={form.submit} />}
          >
            hello
            {/* <FieldArray
              "hello"
            /> */}
          </Modal>
        </form>
      )}
    />
  );
};

FillMultiVolumeRequest.propTypes = {
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

export default FillMultiVolumeRequest;
