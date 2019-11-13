import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import get from 'lodash/get';
import { injectIntl } from 'react-intl';
import JsBarcode from 'jsbarcode';
import template from './design/pullslip.handlebars';
// eslint-disable-next-line import/no-webpack-loader-syntax
import style from '!!style-loader?injectType=lazyStyleTag!postcss-loader!./design/style.css';
import logoUrl from './design/images/palci-logo.png';

// Based on sample code in the "With svg" section at https://github.com/lindell/JsBarcode/blob/master/README.md
function barCodeString(text, options) {
  const { DOMImplementation, XMLSerializer } = require('xmldom');
  const xmlSerializer = new XMLSerializer();
  const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
  const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  JsBarcode(svgNode, text, Object.assign({}, { xmlDocument: document }, options));
  return xmlSerializer.serializeToString(svgNode);
}

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

  return {
    borrower: record.patronReference, // XXX Should be "Last Name, First Name"
    pickupLocation: record.pickShelvingLocation,
    requestBarcode: styledBarCodeString(record.id.substring(0, 18)),
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
