import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import { injectIntl } from 'react-intl';
import Handlebars from 'handlebars';
import slipTemplate from './design/slip.handlebars';
import wrapperTemplate from './design/allslipswrapper.handlebars';
import { establishStylesHook, recordToPullSlipData } from './util';

function makePairs(singles, fallback) {
  const pairs = [];
  for (let i = 0; i < singles.length; i += 2) {
    pairs.push({
      first: singles[i],
      second: singles[i + 1] || fallback,
    });
  }
  return pairs;
}

const AllPullSlips = (props) => {
  useEffect(establishStylesHook, []);
  Handlebars.registerPartial('slip', slipTemplate);
  const records = props.records.map(r => recordToPullSlipData(props.intl, r));
  const s = wrapperTemplate({ pairs: makePairs(records, {}) });
  return (new Parser()).parse(s);
};

AllPullSlips.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.object.isRequired,
  ).isRequired,
};

export default injectIntl(AllPullSlips);
