import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import { injectIntl } from 'react-intl';
import template from './design/pullslip.handlebars';
import { establishStylesHook, recordToPullSlipData } from './util';

const PullSlip = (props) => {
  useEffect(establishStylesHook, []);
  const s = template(recordToPullSlipData(props.intl, props.record));
  return (new Parser()).parse(s);
};

PullSlip.propTypes = {
  record: PropTypes.object.isRequired,
};

export default injectIntl(PullSlip);
