/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { ShowModalButton } from '../../ModalButtons';

export { default as Generic } from './Generic';

// Named corresponding to actions
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
    onClick={() => performAction(
    'supplierMarkConditionsAgreed',
    false,
    'ui-rs.actions.supplierMarkConditionsAgreed.success',
    'ui-rs.actions.supplierMarkConditionsAgreed.error'
    )}
    buttonStyle="primary mega"
    fullWidth
  >
    <FormattedMessage id="ui-rs.actions.supplierMarkConditionsAgreed" />
  </Button>
);

export const RequesterAgreeConditions = ({ performAction }) => (
  <Button
    onClick={() => performAction(
    'requesterAgreeConditions',
    false,
    'ui-rs.actions.requesterAgreeConditions.success',
    'ui-rs.actions.requesterAgreeConditions.error'
    )}
    buttonStyle="primary mega"
    fullWidth
  >
    <FormattedMessage id="ui-rs.actions.requesterAgreeConditions" />
  </Button>
);

export { default as SupplierCheckInToReshare } from './SupplierCheckInToReshare';

// Client only, component names do not correspond to actions
export const PrintPullSlip = () => <Button buttonStyle="primary mega" fullWidth to="pullslip">Print pull slip</Button>;
