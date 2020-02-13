/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import ScanConfirmAction from '../ScanConfirmAction';

export { default as Generic } from './Generic';

export const RequesterManualCheckIn = ({ performAction }) => (
  <Button
    onClick={() => performAction(
      'requesterManualCheckIn',
      false,
      'ui-rs.actions.manualCheckIn.success',
      'ui-rs.actions.manualCheckIn.error'
    )}
    buttonStyle="primary mega"
    fullWidth
  >
    <FormattedMessage id="ui-rs.actions.manualCheckIn" />
  </Button>
);

export const RequesterReceived = props => <ScanConfirmAction
  action="requesterReceived"
  prompt="ui-rs.actions.markReceived.prompt"
  success="ui-rs.actions.markReceived.success"
  error="ui-rs.actions.markReceived.error"
  {...props}
/>;

export const PatronReturnedItem = props => <ScanConfirmAction
  action="patronReturnedItem"
  prompt="ui-rs.actions.markReturned.prompt"
  success="ui-rs.actions.markReturned.success"
  error="ui-rs.actions.markReturned.error"
  withoutNote
  {...props}
/>;

export const ShippedReturn = props => <ScanConfirmAction
  action="shippedReturn"
  prompt="ui-rs.actions.markShippedReturn.prompt"
  success="ui-rs.actions.markShippedReturn.success"
  error="ui-rs.actions.markShippedReturn.error"
  {...props}
/>;

export const SupplierCheckOutOfReshare = props => <ScanConfirmAction
  action="supplierCheckOutOfReshare"
  prompt="ui-rs.actions.checkOut.prompt"
  success="ui-rs.actions.checkOut.success"
  error="ui-rs.actions.checkOut.error"
  withoutNote
  {...props}
/>;

export const SupplierMarkShipped = props => <ScanConfirmAction
  action="supplierMarkShipped"
  prompt="ui-rs.actions.markShipped.prompt"
  error="ui-rs.actions.markShipped.error"
  success="ui-rs.actions.markShipped.success"
  {...props}
/>;
export const PrintPullSlip = () => <Button buttonStyle="primary mega" fullWidth to="pullslip">Print pull slip</Button>;
export { default as SupplierCheckInToReshare } from './SupplierCheckInToReshare';
