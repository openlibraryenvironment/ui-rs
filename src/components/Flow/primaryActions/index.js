import React from 'react';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { DirectLink } from '@projectreshare/stripes-reshare';
import { ShowModalButton } from '../../ModalButtons';

export { default as Generic } from './Generic';

// Named corresponding to actions
export const RequesterManualCheckIn = ({ performAction }) => (
  <Button
    onClick={() => performAction('requesterManualCheckIn', false, {
      success: 'ui-rs.actions.manualCheckIn.success',
      error: 'ui-rs.actions.manualCheckIn.error'
    })}
    buttonStyle="primary mega"
    fullWidth
  >
    <FormattedMessage id="ui-rs.actions.manualCheckIn" />
  </Button>
);

export const SupplierRespondToCancel = () => (
  <ShowModalButton
    modal="RespondToCancel"
    buttonStyle="primary mega"
    fullWidth
  >
    <FormattedMessage id="stripes-reshare.actions.supplierRespondToCancel" />
  </ShowModalButton>
);

export const SupplierMarkConditionsAgreed = ({ performAction }) => (
  <Button
    onClick={() => performAction('supplierMarkConditionsAgreed', false, {
      success: 'ui-rs.actions.supplierMarkConditionsAgreed.success',
      error: 'ui-rs.actions.supplierMarkConditionsAgreed.error'
    })}
    buttonStyle="primary mega"
    fullWidth
  >
    <FormattedMessage id="ui-rs.actions.supplierMarkConditionsAgreed" />
  </Button>
);

export const FillLocally = ({ performAction }) => (
  <Button
    onClick={() => performAction('fillLocally', false, {
      success: 'stripes-reshare.actions.fillLocally.success',
      error: 'stripes-reshare.actions.fillLocally.error'
    })}
    buttonStyle="primary mega"
    fullWidth
  >
    <FormattedMessage id="stripes-reshare.actions.fillLocally" />
  </Button>
);

export const RequesterAgreeConditions = ({ performAction }) => (
  <Button
    onClick={() => performAction('requesterAgreeConditions', false, {
      success: 'ui-rs.actions.requesterAgreeConditions.success',
      error: 'ui-rs.actions.requesterAgreeConditions.error'
    })}
    buttonStyle="primary mega"
    fullWidth
  >
    <FormattedMessage id="ui-rs.actions.requesterAgreeConditions" />
  </Button>
);

export { default as SupplierCheckInToReshare } from './SupplierCheckInToReshare';
export { default as SupplierFillDigitalLoan } from './SupplierFillDigitalLoan';
export { default as PatronReturnedItem } from './PatronReturnedItem';
<<<<<<< Updated upstream
=======
export { default as NonreturnableSupplierAddURLToDocument } from './NonreturnableSupplierAddURLToDocument';
>>>>>>> Stashed changes


// Client only, component names do not correspond to actions
export const PrintPullSlip = () => (
  <DirectLink component={Button} buttonStyle="primary mega" fullWidth to="pullslip">
    <FormattedMessage id="ui-rs.printPullslip" />
  </DirectLink>
);
