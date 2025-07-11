import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form, Field } from 'react-final-form';
import { Button, Row, Col, TextField, Datepicker } from '@folio/stripes/components';
import { useSetting } from '@projectreshare/stripes-reshare';
import useActionConfig from '../useActionConfig';

const SupplierCheckInToReshare = ({ performAction }) => {
  const checkOutItemMethodSetting = useSetting('check_out_item', 'hostLMSIntegration');
  const defaultLoanPeriodSetting = useSetting('default_loan_period', 'requests');

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

  if ([checkOutItemMethodSetting, defaultLoanPeriodSetting].some(s => !s.isSuccess)) {
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
