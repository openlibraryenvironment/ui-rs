import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from '@folio/stripes/components';
import { ShowModalButton } from '../../ModalButtons';
import ActionButton from '../ActionButton';

export const RequesterReceived = props => <ActionButton
  action="requesterReceived"
  label="ui-rs.actions.markReceivedWithoutScan"
  success="ui-rs.actions.markReceived.success"
  error="ui-rs.actions.markReceived.error"
  {...props}
/>;

export const PatronReturnedItem = props => <ActionButton
  action="patronReturnedItem"
  label="ui-rs.actions.markReturnedWithoutScan"
  success="ui-rs.actions.markReturned.success"
  error="ui-rs.actions.markReturned.error"
  {...props}
/>;

export const ShippedReturn = props => <ActionButton
  action="shippedReturn"
  label="ui-rs.actions.markShippedReturnWithoutScan"
  success="ui-rs.actions.markShippedReturn.success"
  error="ui-rs.actions.markShippedReturn.error"
  {...props}
/>;

export const SupplierCheckOutOfReshare = props => <ActionButton
  action="supplierCheckOutOfReshare"
  label="ui-rs.actions.checkOutWithoutScan"
  icon="print"
  success="ui-rs.actions.checkOut.success"
  error="ui-rs.actions.checkOut.error"
  {...props}
/>;

export const SupplierMarkPullSlipPrinted = props => <ActionButton
  action="supplierPrintPullSlip"
  label="ui-rs.actions.markSlipPrinted"
  icon="print"
  success="ui-rs.actions.markSlipPrinted.success"
  error="ui-rs.actions.markSlipPrinted.error"
  {...props}
/>;

export const SupplierMarkShipped = props => <ActionButton
  action="supplierMarkShipped"
  label="ui-rs.actions.markShippedWithoutScan"
  icon="archive"
  success="ui-rs.actions.markShipped.success"
  error="ui-rs.actions.markShipped.error"
  {...props}
/>;

export const CannotSupply = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="CannotSupply">
    <Icon icon="times-circle-solid"><FormattedMessage id="ui-rs.actions.cannotSupply" /></Icon>
  </ShowModalButton>
);

export const SendChatMessage = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="SendChatMessage">
    <Icon icon="times-circle-solid"><FormattedMessage id="ui-rs.actions.sendChatMessage" /></Icon>
  </ShowModalButton>
);

// Alternatives to primaryActions for display in dropdowns
export const PrintPullSlip = () => <Button buttonStyle="dropdownItem" to="pullslip"><Icon icon="print">Print pull slip</Icon></Button>;
