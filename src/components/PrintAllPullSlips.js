// See comment on security issues in PrintPullSlip.js

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactToPrint from 'react-to-print';
import { Button } from '@folio/stripes/components';
import AllPullSlips from './PullSlip/AllPullSlips';

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

  constructor(props) {
    super(props);
    this.ref = React.createRef();
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
      <div>
        <ReactToPrint
          trigger={() => (
            <Button data-test-print-pull-slip marginBottom0>
              <FormattedMessage id="ui-rs.button.print" />
            </Button>
          )}
          content={() => this.ref.current}
        />
        <div ref={this.ref}>
          <AllPullSlips records={records} />
        </div>
      </div>
    );
  }
}

export default PrintAllPullSlips;
