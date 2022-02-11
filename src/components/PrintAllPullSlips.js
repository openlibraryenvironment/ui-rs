import React, { useContext } from 'react';
import { useLocation, useHistory } from 'react-router';
import { includes, filter } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Button } from '@folio/stripes/components';
import { CalloutContext, useOkapiKy } from '@folio/stripes/core';
import { onCloseDirect } from '@reshare/stripes-reshare';
import AllPullSlips from './PullSlip/AllPullSlips';
import PrintOrCancel from './PrintOrCancel';
import upNLevels from '../util/upNLevels';

const PrintAllPullSlips = ({ query: requestsQuery }) => {
  const callout = useContext(CalloutContext);
  const history = useHistory();
  const location = useLocation();
  const okapiKy = useOkapiKy();

  const destUrl = upNLevels(location, 1);
  const records = requestsQuery?.data?.pages?.flatMap(x => x.results);
  const totalRecords = requestsQuery?.data?.pages?.[0]?.total;

  const markAllPrintableAsPrinted = () => {
    const promises = [];

    requestsQuery?.data?.pages?.flatMap(x => x.results).forEach(record => {
      if (includes(record.validActions, 'supplierPrintPullSlip')) {
        promises.push(okapiKy(`rs/patronrequests/${record.id}/performAction`, {
          method: 'POST',
          json: { action: 'supplierPrintPullSlip' },
        }).json());
      }
    });

    Promise.all(promises)
      .catch((exception) => {
        callout.sendCallout({ type: 'error', message: `Protocol failure in marking slips as printed: ${exception}` });
      })
      .then((responses) => {
        const failures = filter(responses, r => !r.status);
        if (failures.length === 0) {
          callout.sendCallout({ type: 'success', message: `All slips ${responses.length === 0 ? 'were already ' : ''}marked as printed.` });
        } else {
          const messages = failures.map(f => f.message).join('; ');
          console.error(messages); // eslint-disable-line no-console
          callout.sendCallout({ type: 'error', message: `Some slips not marked as printed: ${messages}` });
        }
        // Need to re-fetch requests to reflect updated states
        requestsQuery.refetch();
      });
  };

  if (!requestsQuery.isSuccess) {
    return 'Record not yet loaded for printing';
  }

  if (records.length < totalRecords) {
    return `Not enough records loaded for printing (${records.length} of ${totalRecords})`;
  }

  return (
    <>
      <PrintOrCancel
        destUrl={destUrl}
        extraButtons={
          <Button
            marginBottom0
            onClick={() => {
              markAllPrintableAsPrinted();
              onCloseDirect(destUrl, history, location)();
            }}
          >
            <FormattedMessage id="ui-rs.markAllSlipsPrinted" />
          </Button>
        }
      >
        <AllPullSlips records={records} />
      </PrintOrCancel>
    </>
  );
};

export default PrintAllPullSlips;
