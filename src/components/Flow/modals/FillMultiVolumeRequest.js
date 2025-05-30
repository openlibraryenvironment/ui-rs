/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import arrayMutators from 'final-form-arrays';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAppSettings, useKiwtFieldArray } from '@k-int/stripes-kint-components';

import {
  Button,
  Col,
  Datepicker,
  Headline,
  Icon,
  IconButton,
  MessageBanner,
  Modal,
  ModalFooter,
  NoValue,
  Row,
  TextField
} from '@folio/stripes/components';
import { useIsActionPending } from '@projectreshare/stripes-reshare';

import volumeStateStatus from '../../../util/volumeStateStatus';
import { required as requiredValidator } from '../../../util/validators';
import { CancelModalButton } from '../../ModalButtons';
import { useModal } from '../../MessageModalState';

import useActionConfig from '../useActionConfig';
import { SETTINGS_ENDPOINT } from '../../../constants/endpoints';


const ItemBarcodeFieldArray = ({
  fields: {
    name
  },
  request: {
    state: {
      code: requestCode
    }
  }
}) => {
  const {
    items,
    onAddField,
    onDeleteField
  } = useKiwtFieldArray(name, true);

  const renderAddBarcode = () => {
    return (
      <Button
        id="add-volume-btn"
        onClick={() => onAddField({ })}
      >
        <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest.addVolume" />
      </Button>
    );
  };

  return (
    <>
      <Row>
        <Col xs={3}>
          <Headline size="medium">
            <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest.label" />
          </Headline>
        </Col>
        <Col xs={4}>
          <Headline size="medium">
            <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest.barcode" />
          </Headline>
        </Col>
        <Col xs={4}>
          <Headline size="medium">
            <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest.status" />
          </Headline>
        </Col>
      </Row>
      {items.map((volume, index) => {
        const vss = volumeStateStatus(volume, requestCode);
        return (
          <Row key={index}>
            <Col xs={3}>
              <Field
                name={`${name}[${index}].name`}
                component={TextField}
                required
                validate={requiredValidator}
              />
            </Col>
            <Col xs={4}>
              <Field
                autoFocus={index === items.length - 1}
                disabled={vss}
                name={`${name}[${index}].itemId`}
                component={TextField}
                required
                validate={requiredValidator}
              />
            </Col>
            <Col xs={4}>
              <Icon
                icon={vss ? 'check-circle' : 'exclamation-circle'}
                size="small"
                status={vss ? 'success' : 'warn'}
              >
                {volume.status?.value ?
                  <FormattedMessage id={`ui-rs.flow.volumes.status.${volume.status.value}`} /> :
                  <NoValue />
                }
              </Icon>
            </Col>
            {!vss &&
              <Col xs={1}>
                <IconButton
                  icon="trash"
                  id="remove-volume-button"
                  onClick={() => onDeleteField(index, volume)}
                />
              </Col>
            }
          </Row>
        );
      })}
      {renderAddBarcode()}
    </>
  );
};

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const FillMultiVolumeRequest = ({ request, performAction }) => {
  const actionPending = !!useIsActionPending(request.id);
  const [currentModal, setModal] = useModal();
  const closeModal = () => setModal(null);
  const intl = useIntl();

  const { combine_fill_and_ship } = useActionConfig();
  const combine = combine_fill_and_ship === 'yes';

  const checkOutItemMethodSetting = useAppSettings({
    endpoint: SETTINGS_ENDPOINT,
    sectionName: 'hostLMSIntegration',
    keyName: 'check_out_item',
    returnQuery: true
  });

  const defaultLoanPeriodSetting = useAppSettings({
    endpoint: SETTINGS_ENDPOINT,
    sectionName: 'requests',
    keyName: 'default_loan_period',
    returnQuery:true
  });

  const getDateFromDays = days => {
    const date = new Date(Date.now());
    date.setDate(date.getDate() + days);
    return date.toDateString();
  };

  const onSubmit = values => {
    return performAction(
      combine ?
        'supplierCheckInToReshareAndSupplierMarkShipped' :
        'supplierCheckInToReshare',
      values, {
        success: 'ui-rs.actions.fillMultiVolumeRequest.success',
        error: 'ui-rs.actions.fillMultiVolumeRequest.error',
      }
    )
      .then(closeModal);
  };

  const fillMultiVolumeRequestLabel = combine ?
    <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequestAndShip" /> :
    <FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest" />;

  const Footer = ({ disableSubmit, submit }) => (
    <ModalFooter>
      {/* These appear in the reverse order? */}
      <Button buttonStyle="danger" onClick={submit} disabled={disableSubmit}>
        {fillMultiVolumeRequestLabel}
      </Button>
      <CancelModalButton><FormattedMessage id="ui-rs.button.goBack" /></CancelModalButton>
    </ModalFooter>
  );
  Footer.propTypes = {
    disableSubmit: PropTypes.bool,
    submit: PropTypes.func.isRequired,
  };

  if (isEmpty(defaultLoanPeriodSetting) ||
      isEmpty(checkOutItemMethodSetting)) {
    return null;
  }

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
            label={fillMultiVolumeRequestLabel}
            open={currentModal === 'FillMultiVolumeRequest'}
            onClose={closeModal}
            dismissible
            footer={<Footer disableSubmit={submitting || actionPending} submit={form.submit} />}
          >
            {combine &&
              <MessageBanner
                type="warning"
              >
                <FormattedMessage
                  id="ui-rs.actions.fillMultiVolumeRequest.warning.combine"
                  values={{
                    stateConfigOption: intl.formatMessage({ id: 'ui-rs.settings.stateActionConfig.combineFillAndShip' }),
                    settingValue: combine_fill_and_ship,
                    state: intl.formatMessage({ id: 'stripes-reshare.states.RES_ITEM_SHIPPED' })
                  }}
                />
              </MessageBanner>
            }
            <FieldArray
              name="itemBarcodes"
              request={request}
              component={ItemBarcodeFieldArray}
            />
            { checkOutItemMethodSetting.value === 'none' &&
            <Row>
              <Col xs={8}>
                <Field
                  name="loanDateOverride"
                  label={<FormattedMessage id="ui-rs.flow.info.dueDate" />}
                  component={Datepicker}
                />
              </Col>
            </Row>}
            { (defaultLoanPeriodSetting.value && parseInt(defaultLoanPeriodSetting.value, 10)) && checkOutItemMethodSetting.value === 'none' &&
              <div>Default Due Date: {getDateFromDays(parseInt(defaultLoanPeriodSetting.value, 10))}</div>}
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
