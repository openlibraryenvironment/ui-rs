import React from 'react';
import PropTypes from 'prop-types';
import AllPullSlips from './PullSlip/AllPullSlips';
import PrintOrCancel from './PrintOrCancel';

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
  };

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
      <PrintOrCancel destUrl="..">
        <AllPullSlips records={records} />
      </PrintOrCancel>
    );
  }
}

export default PrintAllPullSlips;
