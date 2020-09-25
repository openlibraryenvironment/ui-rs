import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

const renderCustProp = (custprop) => {
  const isRefdata = custprop.type?.type === 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata';
  return (
    <Col xs={4}>
      <KeyValue
        label={custprop.type?.label}
        value={isRefdata ? custprop.value?.label : custprop.value}
      />
    </Col>
  );
};

const renderCustPropRow = (custprops) => {
  return (
    <Row>
      {custprops.map(custprop => renderCustProp(custprop))}
    </Row>
  );
};

const renderCustProps = (custprops) => {
  // Render the custprops in rows of 3 cols
  const len = custprops.length;
  const numOfRows = Math.ceil(len / 3);
  const slicedArray = [];
  for (let i = 0; i < numOfRows; i++) {
    const endOfSlice = (i + 1) * 3 < len ? (i + 1) * 3 : len;
    slicedArray.push(custprops.slice(i * 3, endOfSlice));
  }
  return slicedArray.map(slice => renderCustPropRow(slice));
};


const LocalDirectoryEntryInfo = (props) => {
  const { record } = props;
  const custprops = Object.values(record?.customProperties ? record?.customProperties : {}).map(cp => (cp?.[0] ? cp?.[0] : {}));
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
