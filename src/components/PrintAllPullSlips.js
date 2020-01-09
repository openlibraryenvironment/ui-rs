// See comment on security issues in PrintPullSlip.js

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import ReactToPrint from 'react-to-print';
import { Button, PaneHeaderIconButton, HotKeys } from '@folio/stripes/components';
import AllPullSlips from './PullSlip/AllPullSlips';
import css from './PrintPullSlip.css';

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
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    const keys = { cancel: ['escape'] };
    const handlers = { cancel: () => this.props.history.push('details') };
    const { hasLoaded, other, records } = this.props.records;

    if (!hasLoaded) {
      return 'Record not yet loaded for printing';
    }

    const totalRecords = other.totalRecords;
    if (records.length < totalRecords) {
      return `Not enough records loaded for printing (${records.length} of ${totalRecords})`;
    }

    return (
      <HotKeys keyMap={keys} handlers={handlers}>
        <div className={css.buttonBar}>
          <div className={css.cancelIcon}>
            <FormattedMessage id="ui-rs.button.cancel-print">
              {ariaLabel => (
                <PaneHeaderIconButton
                  icon="times"
                  to="details"
                  aria-label={ariaLabel}
                />
              )}
            </FormattedMessage>
          </div>
          <ReactToPrint
            trigger={() => (
              <Button data-test-print-pull-slip marginBottom0>
                <FormattedMessage id="ui-rs.button.print" />
              </Button>
            )}
            content={() => this.ref.current}
          />
        </div>
        <div ref={this.ref}>
          <AllPullSlips records={records} />
        </div>
      </HotKeys>
    );
  }
}

export default withRouter(PrintAllPullSlips);
