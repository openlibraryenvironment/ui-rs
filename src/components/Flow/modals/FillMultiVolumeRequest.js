import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';

import { FormattedMessage } from 'react-intl';
import { withKiwtFieldArray } from '@folio/stripes-erm-components';

import { Button, Col, Modal, ModalFooter, Row, TextField } from '@folio/stripes/components';
import { required } from '@folio/stripes/util';
import { ActionContext } from '../ActionContext';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const ItemBarcodeFieldArray = withKiwtFieldArray(({
  items,
  name,
  onAddField,
  onDeleteField
}) => {

  const renderAddBarcode = () => {
    return (
      <Button
        id="add-volume-btn"
        onClick={() => this.props.onAddField()}
      >
        <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest.addVolume" />
      </Button>
    );
  }

  console.log("Items: %o", items)
  return (
    items.map((volume, index) => {
      return (
        <Row>
          <Col xs={6} >
            <Field
              name={`${name}[${index}].name`}
              label="LABEL (CHANGE ME)"
              component={TextField}
            />
          </Col>
          <Col xs={6} >
            <Field
              name={`${name}[${index}].itemId`}
              label="BARCODE (CHANGE ME)"
              component={TextField}
            />
          </Col>
        </Row>
      );
    })
  );
})

const FillMultiVolumeRequest = ({ request, performAction }) => {
  const [actions] = useContext(ActionContext);
  const [currentModal, setModal] = useModal();

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
      initialValues={{
        itemBarcodes: request.volumes
      }}
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
            <FieldArray
              name="itemBarcodes"
              component={ItemBarcodeFieldArray}
            />
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
