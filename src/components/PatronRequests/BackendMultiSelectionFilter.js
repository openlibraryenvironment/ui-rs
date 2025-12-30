import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { debounce } from 'lodash';
import { MultiSelection } from '@folio/stripes/components';
import { useOkapiQuery } from '@projectreshare/stripes-reshare';

// Structure: { [endpoint]: Map<id, label> }
const labelCaches = {};

const MIN_SEARCH_LENGTH = 2;
const DEBOUNCE_MS = 300;

const BackendMultiSelectionFilter = ({
  name,
  selectedValues = [],
  onChange,
  endpoint,
  searchParamsTemplate,
  resultsPath = 'results',
  labelKey,
  valueKey,
  placeholder,
  disabled,
  buildBatchSearchParams,
  ...otherProps
}) => {
  const intl = useIntl();
  const [filterValue, setFilterValue] = useState('');

  const debouncedSetFilterValue = useMemo(
    () => debounce(setFilterValue, DEBOUNCE_MS),
    []
  );

  if (!labelCaches[endpoint]) {
    labelCaches[endpoint] = new Map();
  }
  const cache = labelCaches[endpoint];

  const updateCache = (data) => {
    const results = data?.[resultsPath] || [];
    results.forEach(item => {
      cache.set(item[valueKey], item[labelKey]);
    });
  };

  const shouldFetch = filterValue.length >= MIN_SEARCH_LENGTH;
  const searchParams = shouldFetch
    ? searchParamsTemplate.replace('{searchTerm}', filterValue)
    : '';

  const query = useOkapiQuery(endpoint, {
    searchParams,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
    cacheTime: 2 * 60 * 60 * 1000,
    onSuccess: updateCache,
  });

  // Batch fetch labels for selected values missing from cache
  const missingIds = selectedValues.filter(val => !cache.has(val));
  const batchSearchParams = buildBatchSearchParams && missingIds.length > 0
    ? buildBatchSearchParams(missingIds)
    : '';

  useOkapiQuery(endpoint, {
    searchParams: batchSearchParams,
    enabled: !!batchSearchParams,
    staleTime: 5 * 60 * 1000,
    cacheTime: 2 * 60 * 60 * 1000,
    onSuccess: updateCache,
  });

  const dataOptions = (query.data?.[resultsPath] || [])
    .map(item => ({ label: item[labelKey], value: item[valueKey] }));

  const onChangeHandler = (selectedDataOptions) => {
    onChange({
      name,
      values: selectedDataOptions.map(opt => opt.value)
    });
  };

  const handleFilterChange = (value) => {
    debouncedSetFilterValue(value);
    return { renderedItems: dataOptions, exactMatch: false };
  };

  return (
    <MultiSelection
      dataOptions={dataOptions}
      value={selectedValues
        .map(val => (cache.has(val) ? { label: cache.get(val), value: val } : null))
        .filter(Boolean)}
      onChange={onChangeHandler}
      filter={handleFilterChange}
      showLoading={shouldFetch && query.isLoading}
      placeholder={placeholder || intl.formatMessage({ id: 'ui-rs.filter.typeToSearch' })}
      disabled={disabled}
      {...otherProps}
    />
  );
};

BackendMultiSelectionFilter.propTypes = {
  name: PropTypes.string.isRequired,
  selectedValues: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  endpoint: PropTypes.string.isRequired,
  searchParamsTemplate: PropTypes.string.isRequired,
  resultsPath: PropTypes.string,
  labelKey: PropTypes.string.isRequired,
  valueKey: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  buildBatchSearchParams: PropTypes.func,
};

export default BackendMultiSelectionFilter;
