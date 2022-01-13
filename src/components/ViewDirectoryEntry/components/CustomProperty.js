import React from 'react';
import {
  KeyValue,
} from '@folio/stripes/components';

import { useRefdata } from '@k-int/stripes-kint-components';

const CustomProperty = ({ custprop }) => {
  let displayValue = custprop.value;

  const isRefdata = custprop.type?.type === 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata';
  /* If the refdata is propogated instead of set through this institution's UI
   * then we will not have a full refdata value with label etc.
   * Instead we will only have custprop.value.
   */
  const { 0: { values: valueOptions } = {} } = useRefdata({
    desc: custprop.type?.category?.desc,
    endpoint: 'rs/refdata',
    queryParams: {
      enabled: isRefdata // Only fetch when necessary (Enhancement: Could also ensure not to fetch when we already have value)
    }
  });

  if (isRefdata) {
    // Try to grab refdata label directly, otherwise do the work to filter the list
    displayValue = custprop.value?.label ?? valueOptions?.find(opt => opt.value === custprop.value)?.value ?? custprop.value;
  }

  return (
    <KeyValue
      label={custprop.type?.label}
      value={displayValue}
    />
  );
};

export default CustomProperty;
