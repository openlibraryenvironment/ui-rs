// IMPORTANT NOTE
//
// When running a dev system on localhost under HTTP (not HTTPS), in
// at least some configurations, Firefox 16.0.1 will fail to print,
// reporting "SecurityError: The operation is insecure" when clicking
// the Print button. Possible fixes:
//
// * In `about:config`, remove `localhost` from the the
//   comma-separated list of domains in the
//   `network.trr.excluded-domains` property. This sometimes seems to
//   work, and other times does not.
// * Use Chrome instead of Firefox.
// * Run your development system under HTTPS somehow.

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactToPrint from 'react-to-print';
import { Button } from '@folio/stripes/components';
import PullSlip from './PullSlip';

class PrintPullSlip extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.printableRef = React.createRef();
  }

  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => (
            <Button data-test-print-pull-slip marginBottom0>
              <FormattedMessage id="ui-rs.button.print" />
            </Button>
          )}
          content={() => this.printableRef.current}
        />
        <div ref={this.printableRef}>
          <PullSlip record={this.props.record} />
        </div>
      </div>
    );
  }
}

export default PrintPullSlip;
