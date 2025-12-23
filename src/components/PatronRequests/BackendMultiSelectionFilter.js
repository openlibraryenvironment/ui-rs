import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { MultiSelection } from '@folio/stripes/components';
import { useOkapiQuery } from '@projectreshare/stripes-reshare';

// Structure: { [endpoint]: Map<id, label> }
const labelCaches = {};

const MIN_SEARCH_LENGTH = 2;

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

  // Get or create cache for this endpoint
  if (!labelCaches[endpoint]) {
    labelCaches[endpoint] = new Map();
  }
  const cache = labelCaches[endpoint];

  // Note: MultiSelection already debounces the filter function call at 300ms
  const shouldFetch = filterValue.length >= MIN_SEARCH_LENGTH;
  const searchParams = shouldFetch
    ? searchParamsTemplate.replace('{searchTerm}', filterValue)
    : '';

  const query = useOkapiQuery(endpoint, {
    searchParams,
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
    cacheTime: 2 * 60 * 60 * 1000,
  });

  // Batch fetch labels for selected values missing from cache
  const missingIds = selectedValues.filter(val => !cache.has(val));
  const batchSearchParams = buildBatchSearchParams && missingIds.length > 0
    ? buildBatchSearchParams(missingIds)
    : '';

  const initialFetchQuery = useOkapiQuery(endpoint, {
    searchParams: batchSearchParams,
    enabled: !!batchSearchParams,
    staleTime: 5 * 60 * 1000,
    cacheTime: 2 * 60 * 60 * 1000,
  });

  // Map response data to dataOptions format
  const data = query.data?.[resultsPath] || [];
  const searchResults = data.map(item => ({
    label: item[labelKey],
    value: item[valueKey]
  }));

  // Map initial fetch results
  const initialData = initialFetchQuery.data?.[resultsPath] || [];
  const initialResults = initialData.map(item => ({
    label: item[labelKey],
    value: item[valueKey]
  }));

  // Update cache with new search results
  useEffect(() => {
    searchResults.forEach(item => {
      cache.set(item.value, item.label);
    });
  }, [searchResults, cache]);

  // Update cache with initial fetch results
  useEffect(() => {
    initialResults.forEach(item => {
      cache.set(item.value, item.label);
    });
  }, [initialResults, cache]);

  // Build dataOptions: include search results + initial fetch results + any selected items from cache
  const dataOptions = [...searchResults, ...initialResults];
  selectedValues.forEach(val => {
    if (!dataOptions.find(opt => opt.value === val) && cache.has(val)) {
      dataOptions.push({ label: cache.get(val), value: val });
    }
  });

  const onChangeHandler = (selectedDataOptions) => {
    onChange({
      name,
      values: selectedDataOptions.map(opt => opt.value)
    });
  };

  // Handle filter input changes - called by MultiSelection when asyncFiltering is true
  const handleFilterChange = (value) => {
    setFilterValue(value);
    return { renderedItems: dataOptions, exactMatch: false };
  };

  return (
    <MultiSelection
      asyncFiltering
      dataOptions={dataOptions}
      value={selectedValues
        .map(val => dataOptions.find(opt => opt.value === val))
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
