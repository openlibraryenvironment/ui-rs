import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { AccordionSet, Accordion } from '@folio/stripes/components';
import css from './PullSlip.css';

const PullSlip = (props) => {
  const { record } = props;
  return (
    <div>
      <div className={css.pullslip}>
        <div className={css.section}>
          <h2>Borrower &amp; more</h2>
          <div className={css.patronName}>
            XXX lastname, firstname
            <br />
            ID:
            {record.patronReference}
          </div>
          <div className={css.pickupLocation}>
            XXX pickup location
          </div>
          <div className={css.requestBarcode}>
            XXX barcode TODO
          </div>
          <div className={css.requestId}>
            {record.id}
          </div>
        </div>
        <div className={css.section}>
          <h2>This loan</h2>
          <div className={css.title}>
            {record.title}
          </div>
          <div className={css.author}>
            {record.author}
          </div>
          <div className={css.volume}>
            {record.volume}
          </div>
          <div className={css.mayBeRecalled}>
            This item may be recalled
          </div>
          <div className={css.ifRecalled}>
            If this happens, we&apos;ll send an email with a new due date.
          </div>
          <div className={css.questions}>
            Questions about your loan?
          </div>
          <div className={css.answers}>
            Contact (XXX phone) or
            <br />
            (XXX email)
          </div>
          <div className={css.doNotRemove}>
            Do not remove this slip.
            <br />
            Thank you!
          </div>
        </div>
        <div className={css.section}>
          <h2>Details for staff</h2>
          <div className={css.callNumber}>
            XXX call number
          </div>
          <div className={css.location}>
            XXX location
          </div>
          <div className={css.fromLibrary}>
            {record.supplyingInstitutionSymbol}
          </div>
          <div className={css.toLibrary}>
            {record.requestingInstitutionSymbol}
          </div>
          <div className={css.datePrinted}>
            XXX date right now TODO
          </div>
          <div className={css.consortiumLogo}>
            XXX logo TODO
          </div>
          <div className={css.itemBarcode}>
            XXX item barcode
          </div>
          <div className={css.itemId}>
            XXX item ID
          </div>
        </div>
      </div>

      <AccordionSet>
        <Accordion
          id="callslip-developerInfo"
          closedByDefault
          label={<FormattedMessage id="ui-rs.information.heading.developer" />}
          displayWhenClosed={<FormattedMessage id="ui-rs.information.heading.developer.help" />}
        >
          <pre>{JSON.stringify(record, null, 2)}</pre>
        </Accordion>
      </AccordionSet>
    </div>
  );
};

PullSlip.propTypes = {
  record: PropTypes.object.isRequired,
};

export default PullSlip;
