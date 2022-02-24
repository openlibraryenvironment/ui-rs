import React from 'react';
import { usePerformAction, useOkapiQuery } from '@reshare/stripes-reshare';
import PrintOrCancel from '../components/PrintOrCancel';
import PullSlip from '../components/PullSlip';

const PullSlipRoute = ({ match }) => {
  const id = match.params?.id;
  const performAction = usePerformAction(id);
  const { data: request = {}, isSuccess } = useOkapiQuery(`rs/patronrequests/${id}`, {
    onSuccess: req => {
      if (req.validActions?.includes('supplierPrintPullSlip')) {
        performAction('supplierPrintPullSlip', false, {
          success: 'stripes-reshare.actions.supplierPrintPullSlip.success',
          error: 'stripes-reshare.actions.supplierPrintPullSlip.error'
        });
      }
    }
  });

  if (!isSuccess) return null;
  return (
    <PrintOrCancel>
      <PullSlip record={request} />
    </PrintOrCancel>
  );
};

export default PullSlipRoute;
