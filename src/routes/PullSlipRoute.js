import React from 'react';
import { usePerformAction, useOkapiQuery } from '@reshare/stripes-reshare';
import PrintOrCancel from '../components/PrintOrCancel';
import PullSlip from '../components/PullSlip';
import upNLevels from '../util/upNLevels';

const PullSlipRoute = ({ location, match }) => {
  const id = match.params?.id;
  const performAction = usePerformAction(id);
  const { data: request = {}, isSuccess } = useOkapiQuery(`rs/patronrequests/${id}`, {
    onSuccess: req => {
      if (req.validActions?.includes('supplierPrintPullSlip')) {
        performAction('supplierPrintPullSlip');
      }
    }
  });

  if (!isSuccess) return null;
  return (
    <PrintOrCancel destUrl={upNLevels(location, 1)}>
      <PullSlip record={request} />
    </PrintOrCancel>
  );
};

export default PullSlipRoute;
