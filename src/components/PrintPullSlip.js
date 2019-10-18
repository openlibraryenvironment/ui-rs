import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ReactToPrint from 'react-to-print';
import { AccordionSet, Accordion } from '@folio/stripes/components';
import PullSlip from './PullSlip';

class PrintPullSlip extends React.Component {
  static propTypes = {
    record: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.editorRef = React.createRef();
  }

  render() {
    return (
      <div>
        <ReactToPrint
          trigger={() => <button type="button">Print!</button>}
          content={() => this.editorRef.current}
        />
        <div ref={this.editorRef}>
          <PullSlip record={this.props.record} />
        </div>

        <AccordionSet>
          <Accordion
            id="callslip-developerInfo"
            closedByDefault
            label={<FormattedMessage id="ui-rs.information.heading.developer" />}
            displayWhenClosed={<FormattedMessage id="ui-rs.information.heading.developer.help" />}
          >
            <pre>{JSON.stringify(this.props.record, null, 2)}</pre>
          </Accordion>
        </AccordionSet>
      </div>
    );
  }
}

export default PrintPullSlip;
