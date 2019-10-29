import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import template from './design/pullslip.handlebars';

const PullSlip = (props) => {
  const s = template(props.record);
  const htmlToReactParser = new Parser();
  return htmlToReactParser.parse(s);
};

PullSlip.propTypes = {
  record: PropTypes.object.isRequired,
};

export default PullSlip;
