import React from 'react';
import PropTypes from 'prop-types';
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
    this.oldOnafterprint = onafterprint;
    window.onafterprint = this.afterPrint;
  }

  componentWillUnmount() {
    window.onafterprint = this.oldOnafterPrint;
  }

  afterPrint = (_event) => {
    // Infuriatingly, it seems that no part of `_event` tells us if the print was cancelled
    this.props.mutator.action.POST({ action: 'supplierPrintPullSlip' })
      .then(() => {
        this.callout.current.sendCallout({ type: 'success', message: 'Slip marked as printed.' });
      })
      .catch(() => {
        this.callout.current.sendCallout({ type: 'error', message: 'Cannot mark marked slip as printed.' });
      });
  }

  render() {
    return (
      <React.Fragment>
        <PrintOrCancel destUrl="details">
          <PullSlip record={this.props.record} />
        </PrintOrCancel>
        <Callout ref={this.callout} />
      </React.Fragment>
    );
  }
}


export default stripesConnect(PrintPullSlip);
