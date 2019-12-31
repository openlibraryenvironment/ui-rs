import React from 'react';
import { Button } from '@folio/stripes/components';
import ScanConfirmAction from '../ScanConfirmAction';

export const SupplierMarkShipped = props => <ScanConfirmAction
  action="supplierMarkShipped"
  prompt="ui-rs.actions.markShipped.prompt"
  error="ui-rs.actions.markShipped.error"
  success="ui-rs.actions.markShipped.success"
  {...props}
/>;
export const PrintPullSlip = () => <Button buttonStyle="primary mega" fullWidth to="pullslip">Print pull slip</Button>;
export { default as SupplierCheckInToReshare } from './SupplierCheckInToReshare';
