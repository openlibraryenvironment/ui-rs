import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';

import { FormattedMessage } from 'react-intl';
import { Button, Col, Headline, Icon, IconButton, Modal, ModalFooter, Row, TextField } from '@folio/stripes/components';
import volumeStateStatus from '../../../util/volumeStateStatus';
import useKiwtFieldArray from '../../../util/useKiwtFieldArray';
import { ActionContext } from '../ActionContext';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

const ItemBarcodeFieldArray = ({
  fields: {
    name
  }
}) => {
  const {
    items,
    onAddField,
    onDeleteField,
    requestCode
  } = useKiwtFieldArray(name);

  const renderAddBarcode = () => {
    return (
      <Button
        id="add-volume-btn"
        onClick={() => onAddField()}
      >
        <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest.addVolume" />
      </Button>
    );
  }

  console.log("Items: %o", items)
  return (
    <>
      <Row>
        <Col xs={4}>
          <Headline size="medium">
            LABEL
          </Headline>
        </Col>
        <Col xs={4}>
          <Headline size="medium">
            BARCODE
          </Headline>
        </Col>
        <Col xs={2}>
          <Headline size="medium">
            STATUS
          </Headline>
        </Col>
        <Col xs={2}>
          <Headline size="medium">
            REMOVE
          </Headline>
        </Col>
      </Row>
      {items.map((volume, index) => {
        const vss = volumeStateStatus(volume, requestCode)
        return (
          <Row>
            <Col xs={4} >
              <Field
                name={`${name}[${index}].name`}
                component={TextField}
              />
            </Col>
            <Col xs={4} >
              <Field
                disabled={vss}
                name={`${name}[${index}].itemId`}
                component={TextField}
              />
            </Col>
            <Col xs={2}>
              <Icon
                icon={vss ? 'check-circle' : 'exclamation-circle'}
                size="small"
                status={vss ? 'success' : 'warn'}
              />
            </Col>
            <Col xs={2}>
            <IconButton
              icon="trash"
              id="remove-volume-button"
              onClick={() => onDeleteField(index, volume)}
            />
            </Col>
          </Row>
        );
      })}
    </>
  );
}

const FillMultiVolumeRequest = ({ request, performAction }) => {
  const [actions] = useContext(ActionContext);
  const [currentModal, setModal] = useModal();
  const { state: { code } = {} } = request;

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
      render={({ handleSubmit, submitting, form }) => (
        <form onSubmit={handleSubmit}>
          <Modal
            label={<FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest" />}
            open={currentModal === 'FillMultiVolumeRequest'}
            footer={<Footer disableSubmit={submitting || actions.pending} submit={form.submit} />}
          >
            <FieldArray
              name="itemBarcodes"
              requestCode={code}
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
