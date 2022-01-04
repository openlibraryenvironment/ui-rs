import React from 'react';
import { FormattedMessage } from 'react-intl';
import { DirectLink } from '@reshare/stripes-reshare';
import { Button, Icon } from '@folio/stripes/components';
import { ShowModalButton } from '../../ModalButtons';

export { default as Generic } from './Generic';

// Named corresponding to actions
export const CancelLocal = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="cancelLocal">
    <Icon icon="times-circle-solid"><FormattedMessage id="ui-rs.actions.requesterCancel" /></Icon>
  </ShowModalButton>
);

export const ManualClose = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="ManualClose">
    <Icon icon="exclamation-circle"><FormattedMessage id="ui-rs.actions.manualClose" /></Icon>
  </ShowModalButton>
);

export const SupplierCannotSupply = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="supplierCannotSupply">
    <Icon icon="times-circle-solid"><FormattedMessage id="ui-rs.actions.supplierCannotSupply" /></Icon>
  </ShowModalButton>
);

export const SupplierConditionalSupply = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="ConditionalSupply">
    <Icon icon="ellipsis"><FormattedMessage id="ui-rs.actions.conditionalSupply" /></Icon>
  </ShowModalButton>
);

export const SupplierAddCondition = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="AddCondition">
    <Icon icon="plus-sign"><FormattedMessage id="ui-rs.actions.addCondition" /></Icon>
  </ShowModalButton>
);

export const RequesterCancel = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="requesterCancel">
    <Icon icon="times-circle-solid"><FormattedMessage id="ui-rs.actions.requesterCancel" /></Icon>
  </ShowModalButton>
);

export const RespondYes = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="RespondYes">
    <Icon icon="check-circle"><FormattedMessage id="ui-rs.actions.respondYes" /></Icon>
  </ShowModalButton>
);



// Client only, component names do not correspond to actions
export const PrintPullSlip = () => (
  <DirectLink component={Button} buttonStyle="dropdownItem" to="pullslip">
    <Icon icon="print"><FormattedMessage id="ui-rs.printPullslip" /></Icon>
  </DirectLink>
);

export const FillMultiVolumeRequest = () => (
  <ShowModalButton buttonStyle="dropdownItem" modal="FillMultiVolumeRequest">
    <Icon icon="check-circle"><FormattedMessage id="ui-rs.actions.fillMultiVolumeRequest" /></Icon>
  </ShowModalButton>
);
