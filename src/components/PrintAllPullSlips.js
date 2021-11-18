import React from 'react';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import { includes, filter } from 'lodash';
import { Callout } from '@folio/stripes/components';
import { withOkapiKy } from '@folio/stripes/core';
import AllPullSlips from './PullSlip/AllPullSlips';
import PrintOrCancel from './PrintOrCancel';
import upNLevels from '../util/upNLevels';

class PrintAllPullSlips extends React.Component {
  constructor() {
    super();
    this.callout = React.createRef();
  }

  componentDidMount() {
    this.markAllPrintableAsPrinted();
  }

  markAllPrintableAsPrinted = () => {
    const promises = [];

    this.props.query?.data?.pages?.flatMap(x => x.results).forEach(record => {
      if (includes(record.validActions, 'supplierPrintPullSlip')) {
        promises.push(this.props.okapiKy(`rs/patronrequests/${record.id}/performAction`, {
          method: 'POST',
          json: { action: 'supplierPrintPullSlip' },
        }).json());
      }
    });

    Promise.all(promises)
      .catch((exception) => {
        this.showCallout('error', `Protocol failure in marking slips as printed: ${exception}`);
      })
      .then((responses) => {
        const failures = filter(responses, r => !r.status);
        if (failures.length === 0) {
          this.showCallout('success', `All slips ${responses.length === 0 ? 'were already ' : ''}marked as printed.`);
        } else {
          const messages = failures.map(f => f.message).join('; ');
          console.error(messages); // eslint-disable-line no-console
          this.showCallout('error', `Some slips not marked as printed: ${messages}`);
        }
        // Need to re-fetch requests to reflect updated states
        this.props.query.refetch();
      });
  }

  showCallout(type, message) {
    this.callout.current.sendCallout({ type, message });
  }

  render() {
    const requestsQuery = this.props.query;
    const records = requestsQuery?.data?.pages?.flatMap(x => x.results);
    const totalRecords = requestsQuery?.data?.pages?.[0]?.total;

    if (!requestsQuery.isSuccess) {
      return 'Record not yet loaded for printing';
    }

    if (records.length < totalRecords) {
      return `Not enough records loaded for printing (${records.length} of ${totalRecords})`;
    }

    return (
      <>
        <PrintOrCancel destUrl={upNLevels(this.props.location, 1)}>
          <AllPullSlips records={records} />
        </PrintOrCancel>
        <Callout ref={this.callout} />
      </>
    );
  }
}

export default withOkapiKy(withRouter(PrintAllPullSlips));
