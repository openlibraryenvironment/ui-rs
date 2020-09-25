import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
} from '@folio/stripes/components';
import renderCustProps from '../components/custPropRenderer';

const LocalDirectoryEntryInfo = (props) => {
  const { record } = props;
  const custprops = Object.values(record?.customProperties ? record?.customProperties : {})
    .map(cp => (cp?.[0] ? cp?.[0] : {}))
    .filter(cp => cp.type?.defaultInternal === true);
  return (
    <Accordion
      id={props.id}
      label={<FormattedMessage id="ui-directory.information.local.heading.directoryEntry" />}
      open={props.open}
      onToggle={props.onToggle}
    >
      {renderCustProps(custprops)}
    </Accordion>
  );
};

LocalDirectoryEntryInfo.propTypes = {
  record: PropTypes.object,
  id: PropTypes.string,
  onToggle: PropTypes.func,
  open: PropTypes.bool,
};

export default LocalDirectoryEntryInfo;
