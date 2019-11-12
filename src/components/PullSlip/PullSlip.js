import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import get from 'lodash/get';
import { injectIntl } from 'react-intl';
import template from './design/pullslip.handlebars';
// eslint-disable-next-line import/no-webpack-loader-syntax
import style from '!!style-loader?injectType=lazyStyleTag!postcss-loader!./design/style.css';
import logoUrl from './design/images/palci-logo.png';

function recordToData(intl, record) {
  const now = new Date();

  return {
    borrower: record.patronReference, // XXX Should be "Last Name, First Name"
    pickupLocation: record.pickShelvingLocation,
    requestBarcode: 'YYY requestBarcode',
    requestId: record.id,
    title: record.title,
    author: record.author,
    volume: record.volume,
    phoneNumber: 'XXX phoneNumber',
    emailAddress: 'XXX emailAddress',
    callNumber: record.localCallNumber,
    location: get(record, 'pickLocation.name'),
    fromSlug: 'XXX fromSlug',
    toSlug: record.requestingInstitutionSymbol, // XXX Should be slug from directory entry
    now: `${intl.formatDate(now)} ${intl.formatTime(now)}`,
    logo: logoUrl, // XXX Should be somehow obtained from consortium record in directory
    itemBarcode: 'YYY itemBarcode',
    itemId: 'XXX itemId',
  };
}

const PullSlip = (props) => {
  useEffect(() => {
    style.use();
    return () => {
      style.unuse();
    };
  }, []);

  const data = recordToData(props.intl, props.record);
  const s = template(data);
  const htmlToReactParser = new Parser();
  return htmlToReactParser.parse(s);
};

PullSlip.propTypes = {
  record: PropTypes.object.isRequired,
};

export default injectIntl(PullSlip);
