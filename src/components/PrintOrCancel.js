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
import { withRouter } from 'react-router';
import ReactToPrint from 'react-to-print';
import { Button, PaneHeaderIconButton, HotKeys } from '@folio/stripes/components';
import { onCloseDirect } from '@folio/stripes-reshare';
import css from './PrintPullSlip.css';

class PrintOrCancel extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.object,
    destUrl: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
  };

  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  render() {
    const keys = { cancel: ['escape'] };
    const handlers = { cancel: onCloseDirect(this.props.destUrl, this.props?.history, this.props?.location) };

    return (
      <HotKeys keyMap={keys} handlers={handlers} attach={document.body} focused>
        <div className={css.buttonBar}>
          <div className={css.cancelIcon}>
            <FormattedMessage id="ui-rs.button.cancel-print">
              {ariaLabel => (
                <PaneHeaderIconButton
                  icon="times"
                  onClick={handlers.cancel}
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
          {this.props.children}
        </div>
      </HotKeys>
    );
  }
}

export default withRouter(PrintOrCancel);
