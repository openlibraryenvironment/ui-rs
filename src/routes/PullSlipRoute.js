import React from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import { Pane, Paneset } from '@folio/stripes/components';
import { usePerformAction } from '@reshare/stripes-reshare';

const PullSlipRoute = ({ match, history }) => {
  const requestId = match.params?.id;
  const batchId = match.params?.batchId;
  const intl = useIntl();
  const okapiKy = useOkapiKy();
  const performAction = usePerformAction(requestId);
  const title = intl.formatMessage({ id: requestId ? 'ui-rs.pullSlip' : 'ui-rs.pullSlips' });
  const fetchPath = 'rs/report/generatePicklist';
  const fetchParams = requestId ? { requestId } : { batchId };
  const { data, isSuccess } = useQuery({
    queryKey: [fetchPath, fetchParams],
    queryFn: () => okapiKy(fetchPath, { searchParams: fetchParams }).blob(),
  });

  if (!isSuccess) return null;
  const url = URL.createObjectURL(data);
  return (
    <Paneset>
      <Pane
        defaultWidth="100%"
        // centerContent
        onClose={history.goBack}
        dismissible
        paneTitle={title}
      >
        <iframe src={url} width="100%" height="100%" title={title} />
      </Pane>
    </Paneset>
  );
};

export default PullSlipRoute;
