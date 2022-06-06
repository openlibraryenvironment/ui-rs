import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import { injectIntl } from 'react-intl';
// Need to directory dive here until we upgrade to something including this or similar:
// https://github.com/handlebars-lang/handlebars.js/commit/c6c6bbb41f94b3ce7cbd68ede3fbc3f569dfc7e7
import Handlebars from 'handlebars/lib/handlebars';
import slipTemplate from './design/slip.handlebars';
import wrapperTemplate from './design/singleslipwrapper.handlebars';
import { establishStylesHook, recordToPullSlipData } from './util';

const PullSlip = (props) => {
  useEffect(establishStylesHook, []);
  Handlebars.registerPartial('slip', slipTemplate);
  const s = wrapperTemplate(recordToPullSlipData(props.intl, props.record));
  return (new Parser()).parse(s);
};

PullSlip.propTypes = {
  record: PropTypes.object.isRequired,
};

export default injectIntl(PullSlip);
