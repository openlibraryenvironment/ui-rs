import React, { useEffect } from 'react';
import { useIsActionPending, usePerformAction, useOkapiQuery } from '@reshare/stripes-reshare';
import PrintOrCancel from '../components/PrintOrCancel';
import PullSlip from '../components/PullSlip';
import upNLevels from '../util/upNLevels';

const PullSlipRoute = ({ location, match }) => {
  const id = match.params?.id;
  const performAction = usePerformAction(id);
  const pending = useIsActionPending(id);
  const { data: request = {}, isSuccess, isFetching, isStale } = useOkapiQuery(`rs/patronrequests/${id}`, { staleTime: 2 * 60 * 1000 });

  useEffect(() => {
    if (isSuccess && !isFetching && !isStale && pending === 0 && request.validActions?.includes('supplierPrintPullSlip')) {
      performAction('supplierPrintPullSlip');
    }
  }, [isFetching, isSuccess, isStale, pending, performAction, request]);

  if (!isSuccess) return null;
  return (
    <PrintOrCancel destUrl={upNLevels(location, 1)}>
      <PullSlip record={request} />
    </PrintOrCancel>
  );
};

export default PullSlipRoute;
