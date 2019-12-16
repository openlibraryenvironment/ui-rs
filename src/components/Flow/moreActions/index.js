import React from 'react';
import { Button } from '@folio/stripes/components';
import ActionButton from '../ActionButton';

export const SupplierMarkPullSlipPrinted = props => <ActionButton
  action="supplierPrintPullSlip"
  label="Mark pull slip as printed"
  successMessage="ui-rs.actions.markSlipPrinted.success"
  errorMessage="ui-rs.actions.markSlipPrinted.error"
  {...props}
/>;

export const PrintPullSlip = () => <Button buttonStyle="dropdownItem" to="pullslip">Print pull slip</Button>;
