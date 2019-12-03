import React from 'react';
import { Button } from '@folio/stripes/components';
import ActionButton from '../ActionButton';

export const SupplierMarkPullSlipPrinted = props => <ActionButton
  action="supplierPrintPullSlip"
  label="Mark pull slip as printed"
  successMessage="Pull slip marked as printed."
  errorMessage="Error marking pull slip as printed."
  {...props}
/>;

export const PrintPullSlip = () => <Button buttonStyle="dropdownItem" to="pullslip">Print pull slip</Button>;
