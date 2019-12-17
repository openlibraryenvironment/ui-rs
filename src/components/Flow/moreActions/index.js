import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@folio/stripes/components';
import { ShowModalButton } from '../../ModalButtons';
import ActionButton from '../ActionButton';

export const SupplierMarkPullSlipPrinted = props => <ActionButton
  action="supplierPrintPullSlip"
  label="Mark pull slip as printed"
  successMessage="ui-rs.actions.markSlipPrinted.success"
  errorMessage="ui-rs.actions.markSlipPrinted.error"
  {...props}
/>;

export const CannotSupply = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="CannotSupply">
    <FormattedMessage id="ui-rs.actions.cannotSupply" />
  </ShowModalButton>
);

// Alternatives to primaryActions for display in dropdowns
export const PrintPullSlip = () => <Button buttonStyle="dropdownItem" to="pullslip">Print pull slip</Button>;
