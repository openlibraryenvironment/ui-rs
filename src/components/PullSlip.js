import React from 'react';
import PropTypes from 'prop-types';
import { FormattedDate, FormattedTime } from 'react-intl';
import Barcode from 'react-barcode';
import css from './PullSlip.css';
import logo from './images/palci-logo.png';

const PullSlip = (props) => {
  const { record } = props;
  const now = new Date();

  return (
    <div>
      <div className={css.pullslip}>
        <div className={css.section}>
          <h2>Borrower &amp; more</h2>
          <div className={css.patronName}>
            XXX lastname, firstname
            (ID:
            {record.patronReference}
            )
          </div>
          <div className={css.pickupLocation}>
            {(record.pickLocation || {}).name}
          </div>
          <div className={css.requestBarcode}>
            <Barcode value={record.id} />
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
            <div>
              Do not remove
              <br />
              this slip.
              <br />
              Thank you!
            </div>
          </div>
        </div>
        <div className={css.section}>
          <h2>Details for staff</h2>
          <div className={css.callNumber}>
            {record.localCallNumber}
          </div>
          <div className={css.location}>
            {record.pickShelvingLocation}
          </div>
          <div className={css.fromLibrary}>
            {record.supplyingInstitutionSymbol}
          </div>
          <div className={css.toLibrary}>
            {record.requestingInstitutionSymbol}
          </div>
          <div className={css.datePrinted}>
            <FormattedDate value={now} />
            &nbsp;
            <FormattedTime value={now} />
          </div>
          <div className={css.consortiumLogo}>
            <img src={logo} height="66" width="179" alt="PALCI logo" />
          </div>
          <div className={css.itemBarcode}>
            XXX item barcode
          </div>
          <div className={css.itemId}>
            XXX item ID
          </div>
        </div>
      </div>
    </div>
  );
};

PullSlip.propTypes = {
  record: PropTypes.object.isRequired,
};

export default PullSlip;
