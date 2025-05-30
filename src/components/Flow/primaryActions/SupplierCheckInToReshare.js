import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField, Datepicker} from '@folio/stripes/components';
import { useAppSettings } from '@k-int/stripes-kint-components';
import useActionConfig from '../useActionConfig';
import { SETTINGS_ENDPOINT } from '../../../constants/endpoints';

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

const SupplierCheckInToReshare = ({ performAction }) => {
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

  // eslint-disable-next-line camelcase
  const { combine_fill_and_ship } = useActionConfig();
  // eslint-disable-next-line camelcase
  const combine = combine_fill_and_ship === 'yes';

  const onSubmit = values => performAction(
    combine ?
      'supplierCheckInToReshareAndSupplierMarkShipped' :
      'supplierCheckInToReshare',
    values, {
      success: 'ui-rs.actions.checkIn.supplier.success',
      error: 'ui-rs.actions.checkIn.error',
    }
  );


  if (isEmpty(defaultLoanPeriodSetting) ||
      isEmpty(checkOutItemMethodSetting)) {
    return null;
  }

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, submitting }) => (
        <form onSubmit={handleSubmit} autoComplete="off">
          <Row>
            <Col xs={11}>
              <Field
                name="itemBarcodes[0].itemId"
                component={TextField}
                autoFocus
              />
            </Col>
            <Col xs={1}>
              <Button buttonStyle="primary mega" type="submit" disabled={submitting}>
                <FormattedMessage id="ui-rs.button.scan" />
              </Button>
            </Col>
          </Row>
          <FormattedMessage id={`ui-rs.actions.${combine ? 'checkInAndShip' : 'checkIn'}.prompt`} />
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
        </form>
      )}
    />
  );
};
SupplierCheckInToReshare.propTypes = {
  performAction: PropTypes.func.isRequired,
};
export default SupplierCheckInToReshare;
