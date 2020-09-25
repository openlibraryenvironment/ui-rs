import React from 'react';
import {
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

export default renderCustProps;
