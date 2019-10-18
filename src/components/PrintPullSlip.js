import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { AccordionSet, Accordion } from '@folio/stripes/components';
import PullSlip from './PullSlip';

const PrintPullSlip = (props) => {
  return (
    <div>
      <PullSlip record={props.record} />
      <AccordionSet>
        <Accordion
          id="callslip-developerInfo"
          closedByDefault
          label={<FormattedMessage id="ui-rs.information.heading.developer" />}
          displayWhenClosed={<FormattedMessage id="ui-rs.information.heading.developer.help" />}
        >
          <pre>{JSON.stringify(props.record, null, 2)}</pre>
        </Accordion>
      </AccordionSet>
    </div>
  );
};

PrintPullSlip.propTypes = {
  record: PropTypes.object.isRequired,
};

export default PrintPullSlip;
