import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import get from 'lodash/get';
import { injectIntl } from 'react-intl';
import barCodeString from './BarCodeString';
import template from './design/pullslip.handlebars';
// eslint-disable-next-line import/no-webpack-loader-syntax
import reset from '!!style-loader?injectType=lazyStyleTag!css-loader!reset-css/reset.css';
// eslint-disable-next-line import/no-webpack-loader-syntax
import style from '!!style-loader?injectType=lazyStyleTag!postcss-loader!./design/style.css';
import logoUrl from './design/images/palci-logo.png';

function styledBarCodeString(text) {
  return barCodeString(text, {
    format: 'code39',
    displayValue: false,
    background: 'transparent',
    lineColor: '#000000',
    margin: 0,
    marginLeft: 0,
    height: 30,
    width: 1
  });
}

function recordToData(intl, record) {
  const now = new Date();
  const id = record.hrid || record.id;
  let name;
  if (record.patronSurname) {
    name = record.patronSurname;
    if (record.patronGivenName) name = `${name}, ${record.patronGivenName}`;
  } else {
    // Better than nothing
    name = record.patronReference;
  }

  return {
    borrower: name,
    pickupLocation: record.pickShelvingLocation,
    requestBarcode: styledBarCodeString(id.substring(0, 18)),
    requestId: id,
    title: record.title,
    author: record.author,
    volume: record.volume,
    phoneNumber: get(record, 'resolvedRequester.owner.phoneNumber'),
    emailAddress: get(record, 'resolvedRequester.owner.emailAddress'),
    callNumber: record.localCallNumber,
    location: get(record, 'pickLocation.name'),
    fromSlug: get(record, 'resolvedSupplier.owner.slug'),
    toSlug: get(record, 'resolvedRequester.owner.slug') || record.requestingInstitutionSymbol,
    now: `${intl.formatDate(now)} ${intl.formatTime(now)}`,
    logo: logoUrl, // XXX Should be somehow obtained from consortium record in directory
    itemBarcode: styledBarCodeString(record.selectedItemBarcode),
    itemId: record.selectedItemBarcode,
  };
}

const PullSlip = (props) => {
  useEffect(() => {
    reset.use();
    style.use();
    return () => {
      style.unuse();
      reset.unuse();
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
