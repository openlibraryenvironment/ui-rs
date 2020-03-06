/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

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

export { default as SupplierCheckInToReshare } from './SupplierCheckInToReshare';

// Client only, component names do not correspond to actions
export const PrintPullSlip = () => <Button buttonStyle="primary mega" fullWidth to="pullslip">Print pull slip</Button>;
