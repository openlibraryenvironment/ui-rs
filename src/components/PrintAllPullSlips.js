import React from 'react';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import { includes, filter } from 'lodash';
import { Callout } from '@folio/stripes/components';
import { withOkapiKy } from '@folio/stripes/core';
import AllPullSlips from './PullSlip/AllPullSlips';
import PrintOrCancel from './PrintOrCancel';
import upNLevels from '../util/upNLevels';

class PrintAllPullSlips extends React.Component {
  static propTypes = {
    records: PropTypes.shape({
      hasLoaded: PropTypes.bool.isRequired,
      other: PropTypes.shape({
        totalRecords: PropTypes.number,
      }),
      records: PropTypes.arrayOf(
        PropTypes.object.isRequired,
      ),
    }).isRequired,
    location: PropTypes.object.isRequired,
    okapiKy: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.callout = React.createRef();
  }

  componentDidMount() {
    this.markAllPrintableAsPrinted();
  }

  markAllPrintableAsPrinted = () => {
    const promises = [];

    this.props.records.records.forEach(record => {
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
      });
  }

  showCallout(type, message) {
    this.callout.current.sendCallout({ type, message });
  }

  render() {
    const { hasLoaded, other, records } = this.props.records;

    if (!hasLoaded) {
      return 'Record not yet loaded for printing';
    }

    const totalRecords = other.totalRecords;
    if (records.length < totalRecords) {
      return `Not enough records loaded for printing (${records.length} of ${totalRecords})`;
    }

    // In order to force a refresh of the underlying stripes-connect
    // result-list when we go back to the main record list, we need to
    // include refresh=1 if it was not included, but remove it if it
    // was. This is trickier than it looks: render gets called
    // multiple times, so if we just toggle in render then we will end
    // up with no change if we get called an even number of times. And
    // we can't do the toggle in componentDidMount because `location`
    // is not available there. So we have to reset location.search
    // after having used the modified version to calculate our desired
    // destination URL for the close button.
    const { location } = this.props;
    const oldSearch = location.search;
    const query = queryString.parse(location.search);
    if (query.refresh) {
      delete query.refresh;
    } else {
      query.refresh = 1;
    }
    location.search = '?' + queryString.stringify(query);
    const destUrl = upNLevels(location, 1);
    location.search = oldSearch;

    return (
      <>
        <PrintOrCancel destUrl={destUrl}>
          <AllPullSlips records={records} />
        </PrintOrCancel>
        <Callout ref={this.callout} />
      </>
    );
  }
}

export default withOkapiKy(withRouter(PrintAllPullSlips));
