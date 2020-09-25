import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import renderCustProps from '../components/custPropRenderer';

const CustomProperties = (props) => {
  const { record } = props;
  const custprops = Object.values(record?.customProperties ? record?.customProperties : {})
    .map(cp => (cp?.[0] ? cp?.[0] : {}))
    .filter(cp => cp.type?.defaultInternal === false);
  return (
    <Accordion
      id={props.id}
      label={<FormattedMessage id="ui-directory.information.heading.customProps" />}
      open={props.open}
      onToggle={props.onToggle}
    >
      {renderCustProps(custprops)}
    </Accordion>
  );
};

CustomProperties.propTypes = {
  record: PropTypes.object,
  id: PropTypes.string,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default CustomProperties;
