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

import React, { useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import ReactToPrint from 'react-to-print';
import { Button, PaneHeaderIconButton, HotKeys } from '@folio/stripes/components';
import { useCloseDirect } from '@reshare/stripes-reshare';
import css from './PrintPullSlip.css';

const PrintOrCancel = ({ extraButtons, children }) => {
  const close = useCloseDirect();
  const ref = useRef();
  const keys = { cancel: ['escape'] };
  const handlers = { cancel: close };

  return (
    <HotKeys keyMap={keys} handlers={handlers} attach={document.body} focused>
      <div className={css.buttonBar}>
        <div className={css.cancelIcon}>
          <FormattedMessage id="ui-rs.button.cancel-print">
            {ariaLabel => (
              <PaneHeaderIconButton
                icon="times"
                onClick={close}
                aria-label={ariaLabel[0]}
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
          content={() => ref.current}
        />
        {extraButtons}
      </div>
      <div ref={ref}>
        {children}
      </div>
    </HotKeys>
  );
};

export default PrintOrCancel;
