import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { FormattedMessage, useIntl } from 'react-intl';
import { useOkapiKy } from '@folio/stripes/core';
import { Button, Pane, Paneset } from '@folio/stripes/components';
import {
  upNLevels,
  useIntlCallout,
  useOkapiQuery,
  usePerformAction,
  useCloseDirect
} from '@projectreshare/stripes-reshare';

const PullSlipRoute = ({ match, location }) => {
  const requestId = match.params?.id;
  const batchId = match.params?.batchId;
  const [pdfUrl, setPdfUrl] = useState();
  const intl = useIntl();
  const okapiKy = useOkapiKy();
  const queryClient = useQueryClient();
  const sendCallout = useIntlCallout();
  const performAction = usePerformAction(requestId);
  const title = intl.formatMessage({ id: requestId ? 'ui-rs.pullSlip' : 'ui-rs.pullSlips' });
  const close = useCloseDirect(upNLevels(location, requestId ? 1 : 3));

  const reqQuery = useOkapiQuery(`rs/patronrequests/${requestId}`, {
    enabled: !!requestId,
  });

  const markableAction = reqQuery?.data?.validActions?.find(element => element.endsWith("PrintPullSlip"));

  const fetchPath = 'rs/report/generatePicklist';
  const fetchParams = requestId ? { requestId } : { batchId };
  const pdfQuery = useQuery({
    queryKey: [fetchPath, fetchParams],
    queryFn: () => okapiKy(fetchPath, { searchParams: fetchParams }).blob(),
  });

  useEffect(() => {
    if (pdfQuery.isSuccess && !pdfUrl) {
      setPdfUrl(URL.createObjectURL(pdfQuery.data));
    }
  }, [pdfQuery.isSuccess, pdfQuery.data, pdfUrl]);

  if (!pdfUrl) return null;

  const markPrinted = () => {
    if (requestId && markableAction) {
      performAction(markableAction);
    } else if (batchId) {
      okapiKy('rs/patronrequests/markBatchAsPrinted', { searchParams: { batchId } }).then(() => {
        queryClient.invalidateQueries('rs/patronrequests');
        sendCallout('ui-rs.pullSlip.mark.success');
      }).catch(async e => {
        sendCallout('ui-rs.pullSlip.mark.error', 'error', { errMsg: e.message ?? '' });
      });
    }
  };

  return (
    <Paneset>
      <Pane
        defaultWidth="100%"
        onClose={close}
        dismissible
        paneTitle={title}
        lastMenu={
          <Button
            buttonStyle="primary"
            marginBottom0
            disabled={(requestId && !reqQuery.isSuccess) || (reqQuery.isSuccess && !markableAction)}
            onClick={markPrinted}
          >
            <FormattedMessage id="ui-rs.pullSlip.mark" />
          </Button>
        }
      >
        <iframe src={pdfUrl} width="100%" height="100%" title={title} />
      </Pane>
    </Paneset>
  );
};

export default PullSlipRoute;
