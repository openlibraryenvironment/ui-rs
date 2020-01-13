import React from 'react';
import PropTypes from 'prop-types';
import PullSlip from './PullSlip';
import PrintOrCancel from './PrintOrCancel';

class PrintPullSlip extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
  };

  markPrinted() {
    console.log('it was printed');
  }

  render() {
    return (
      <PrintOrCancel destUrl="details" onPrint={this.markPrinted}>
        <PullSlip record={this.props.record} />
      </PrintOrCancel>
    );
  }
}

export default PrintPullSlip;
