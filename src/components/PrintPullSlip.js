import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import includes from 'lodash/includes';
import { stripesConnect } from '@folio/stripes/core';
import { Callout } from '@folio/stripes/components';
import PullSlip from './PullSlip';
import PrintOrCancel from './PrintOrCancel';


class PrintPullSlip extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
    mutator: PropTypes.shape({
      action: PropTypes.object,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
  };

  static manifest = {
    action: {
      type: 'okapi',
      path: 'rs/patronrequests/!{record.id}/performAction',
      fetch: false,
      clientGeneratePk: false,
    },
  };

  constructor() {
    super();
    this.callout = React.createRef();
  }

  componentDidMount() {
    if (includes(this.props.record.validActions, 'supplierPrintPullSlip')) {
      this.markAsPrinted();
    }
  }

  showCallout(type, message) {
    this.callout.current.sendCallout({ type, message });
  }

  markAsPrinted = () => {
    this.props.mutator.action.POST({ action: 'supplierPrintPullSlip' })
      .then((json) => {
        if (json.status) {
          this.showCallout('success', 'Slip marked as printed.');
        } else {
          // eslint-disable-next-line react/jsx-one-expression-per-line
          this.showCallout('error', <span>Slip <b>not</b> marked as printed: {json.message}</span>);
        }
      })
      .catch((exception) => {
        this.showCallout('error', `Protocol failure in marking slip as printed: ${exception}`);
      });
  }

  render() {
    return (
      <React.Fragment>
        <PrintOrCancel destUrl={`flow${this.props.location.search}`}>
          <PullSlip record={this.props.record} />
        </PrintOrCancel>
        <Callout ref={this.callout} />
      </React.Fragment>
    );
  }
}


export default withRouter(stripesConnect(PrintPullSlip));
