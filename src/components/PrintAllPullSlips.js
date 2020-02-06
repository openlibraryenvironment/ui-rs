import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { includes, filter } from 'lodash';
import { Callout } from '@folio/stripes/components';
import AllPullSlips from './PullSlip/AllPullSlips';
import PrintOrCancel from './PrintOrCancel';
import upNLevels from '../util/upNLevels';
import withOkapiKy from '../util/withOkapiKy';

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

    return (
      <React.Fragment>
        <PrintOrCancel destUrl={upNLevels(this.props.location, 1)}>
          <AllPullSlips records={records} />
        </PrintOrCancel>
        <Callout ref={this.callout} />
      </React.Fragment>
    );
  }
}

export default withOkapiKy(withRouter(PrintAllPullSlips));
