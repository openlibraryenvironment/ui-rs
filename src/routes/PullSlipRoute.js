import React, { useContext } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { FormattedMessage, useIntl } from 'react-intl';
import { CalloutContext, useOkapiKy } from '@folio/stripes/core';
import { Button, Pane, Paneset } from '@folio/stripes/components';
import { useOkapiQuery, usePerformAction } from '@reshare/stripes-reshare';

const PullSlipRoute = ({ match, history }) => {
  const requestId = match.params?.id;
  const batchId = match.params?.batchId;
  const intl = useIntl();
  const okapiKy = useOkapiKy();
  const queryClient = useQueryClient();
  const callout = useContext(CalloutContext);
  const performAction = usePerformAction(requestId);
  const title = intl.formatMessage({ id: requestId ? 'ui-rs.pullSlip' : 'ui-rs.pullSlips' });

  const reqQuery = useOkapiQuery(`rs/patronrequests/${requestId}`, {
    enabled: !!requestId,
    staleTime: 2 * 60 * 1000
  });
  const isReqPrintable = reqQuery?.data?.validActions?.includes('supplierPrintPullSlip');

  const fetchPath = 'rs/report/generatePicklist';
  const fetchParams = requestId ? { requestId } : { batchId };
  const pdfQuery = useQuery({
    queryKey: [fetchPath, fetchParams],
    queryFn: () => okapiKy(fetchPath, { searchParams: fetchParams }).blob(),
  });

  if (!pdfQuery.isSuccess) return null;
  const url = URL.createObjectURL(pdfQuery.data);

  const markPrinted = () => {
    if (requestId && isReqPrintable) {
      performAction('supplierPrintPullSlip');
    } else if (batchId) {
      okapiKy('rs/patronrequests/markBatchAsPrinted', { searchParams: { batchId } }).then(() => {
        queryClient.invalidateQueries('rs/patronrequests');
        callout.sendCallout({ type: 'success', message: intl.formatMessage({ id: 'ui-rs.pullSlip.mark.success' }) });
      }).catch(async e => {
        const message = intl.formatMessage({ id: 'ui-rs.pullSlip.mark.error' }, { errMsg: e.message });
        callout.sendCallout({ type: 'error', message });
      });
    }
  };

  return (
    <Paneset>
      <Pane
        defaultWidth="100%"
        onClose={history.goBack}
        dismissible
        paneTitle={title}
        lastMenu={
          <Button
            buttonStyle="primary"
            marginBottom0
            disabled={(requestId && !reqQuery.isSuccess) || (reqQuery.isSuccess && !isReqPrintable)}
            onClick={markPrinted}
          >
            <FormattedMessage id="ui-rs.pullSlip.mark" />
          </Button>
        }
      >
        <iframe src={url} width="100%" height="100%" title={title} />
      </Pane>
    </Paneset>
  );
};

export default PullSlipRoute;
