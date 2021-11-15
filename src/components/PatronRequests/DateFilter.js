import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, FilterAccordionHeader } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import DateFilterForm from './DateFilterForm';

const fieldOperatorsMap = {
  'dateFrom': '>=',
  'dateTo': '<='
};

const DateFilter = ({
  accordionLabel,
  activeFilters,
  filterHandlers,
  hideNoDateSetCheckbox = false,
  noDateSetCheckboxLabel,
  name,
  resourceName
}) => {
  const noDateSetCheckBoxLabel =
    noDateSetCheckboxLabel ?? <FormattedMessage id={`stripes-erm-components.dateFilter.${name}NotSet`} values={{ resourceName }} />;

  const handleSubmit = (values) => {
    const { dateFrom, dateTo, isDateSet } = values;
    let filterStrings;
    if (!dateFrom && !dateTo && isDateSet) {
      filterStrings = [`${name} isNull`]; // filterString === ["startDate isNull"]
    } else {
      filterStrings = Object.keys(fieldOperatorsMap)
        .filter(fieldName => values[fieldName])
        .map(fieldName => `${name}${fieldOperatorsMap[fieldName]}${values[fieldName]}${isDateSet ? `||${name} isNull` : ''}`); // filter of shape "startDate>=2021-01-04||startDate isNull"
    }

    filterHandlers.state({ ...activeFilters, [name]: filterStrings });
  };

  const filterStrings = activeFilters[name] || [];
  const initialValues = {};
  const operators = Object.values(fieldOperatorsMap);

  // logic to populate the initialValues to be passed to the form
  filterStrings.forEach(filter => {
    const operator = operators.find(op => filter.includes(op)); // finds if the filter has either the <= or >= operator in it
    if (operator) {
      const [date, dateSet] = filter.split('||'); // filter of shape "startDate>=2021-01-04||startDate isNull"
      const dateField = Object.keys(fieldOperatorsMap).find(key => fieldOperatorsMap[key] === operator);
      initialValues[dateField] = date?.split(operator)?.[1]; // sets the dateFrom and dateTo initialValues
      initialValues.isDateSet = dateSet?.split(' ')?.[1] === 'isNull'; // sets the isDateSet initialValue
    } else {
      initialValues.isDateSet = filter?.split(' ')?.[1] === 'isNull'; // filter of shape "startDate isNull"
    }
  });

  return (
    <Accordion
      closedByDefault
      displayClearButton={activeFilters?.[name]?.length > 0}
      header={FilterAccordionHeader}
      id={`clickable-${name}-filter`}
      label={accordionLabel ?? <FormattedMessage id={`stripes-erm-components.dateFilter.${name}`} />}
      onClearFilter={() => filterHandlers.state({ ...activeFilters, [name]: [] })}
      separator={false}
    >
      <DateFilterForm
        hideNoDateSetCheckbox={hideNoDateSetCheckbox}
        initialValues={initialValues}
        noDateSetCheckBoxLabel={noDateSetCheckBoxLabel}
        onSubmit={handleSubmit}
      />
    </Accordion>
  );
};

DateFilter.propTypes = {
  accordionLabel: PropTypes.node,
  activeFilters: PropTypes.object,
  filterHandlers: PropTypes.object,
  hideNoDateSetCheckbox: PropTypes.bool,
  name: PropTypes.string,
  noDateSetCheckboxLabel: PropTypes.node,
  resourceName: PropTypes.string,
};

export default DateFilter;
