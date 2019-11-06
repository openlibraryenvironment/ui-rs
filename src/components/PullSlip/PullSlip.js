import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Parser } from 'html-to-react';
import template from './design/pullslip.handlebars';
// eslint-disable-next-line import/no-webpack-loader-syntax
import style from '!!style-loader?injectType=lazyStyleTag!postcss-loader!./design/style.css';

const PullSlip = (props) => {
  useEffect(() => {
    style.use();
    return () => {
      style.unuse();
    };
  }, []);

  const s = template(props.record);
  const htmlToReactParser = new Parser();
  return htmlToReactParser.parse(s);
};

PullSlip.propTypes = {
  record: PropTypes.object.isRequired,
};

export default PullSlip;
