import React, { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { CheckboxFilter, MultiSelectionFilter } from '@folio/stripes/smart-components';
import {
  Accordion,
  AccordionSet,
  FilterAccordionHeader,
  Selection,
} from '@folio/stripes/components';
// TODO: use DateFilter from stripes-erm-components once version is released with
// accordionLabel prop
// import { DateFilter } from '@folio/stripes-erm-components';
import AppNameContext from '../../AppNameContext';
import DateFilter from './DateFilter';

// import css from './Filters.css';

const Filters = ({ activeFilters, filterHandlers, options, appDetails }) => {
  const onChangeHandler = (group) => {
    filterHandlers.state({
      ...activeFilters,
      [group.name]: group.values
    });
  };
  const appName = useContext(AppNameContext);
  const { intlId, institutionFilterId } = appDetails[appName];

  return (
    <>
      <CheckboxFilter
        name="needsAttention"
        dataOptions={options.needsAttention}
        selectedValues={activeFilters.needsAttention}
        onChange={onChangeHandler}
      />
      <CheckboxFilter
        name="hasCost"
        dataOptions={options.hasCost}
        selectedValues={activeFilters.hasCost}
        onChange={onChangeHandler}
      />
      <CheckboxFilter
        name="hasLocalNote"
        dataOptions={options.hasLocalNote}
        selectedValues={activeFilters.hasLocalNote}
        onChange={onChangeHandler}
      />
      <CheckboxFilter
        name="hasUnread"
        dataOptions={options.hasUnread}
        selectedValues={activeFilters.hasUnread}
        onChange={onChangeHandler}
      />
      <CheckboxFilter
        name="terminal"
        dataOptions={options.terminal}
        selectedValues={activeFilters.terminal}
        onChange={onChangeHandler}
      />
      <AccordionSet>
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.state" />}
          id="state"
          name="state"
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={activeFilters?.state?.length > 0}
          onClearFilter={() => filterHandlers.clearGroup('state')}
        >
          <MultiSelectionFilter
            name="state"
            dataOptions={options.state}
            selectedValues={activeFilters.state}
            onChange={onChangeHandler}
          />
        </Accordion>
        { options.institutions != null &&
        <Accordion
          label={<FormattedMessage id={`ui-rs.filter.${intlId}`} />}
          id="institution"
          name="institution"
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={activeFilters?.[institutionFilterId]?.length > 0}
          onClearFilter={() => filterHandlers.clearGroup(institutionFilterId)}
        >
          <MultiSelectionFilter
            name={institutionFilterId}
            dataOptions={options.institutions}
            selectedValues={activeFilters[institutionFilterId]}
            onChange={onChangeHandler}
          />

        </Accordion>
        }
        {appName === 'supply' &&
          <>
            <Accordion
              label={<FormattedMessage id="ui-rs.patronrequests.pickLocation" />}
              id="location"
              name="location"
              separator={false}
              header={FilterAccordionHeader}
              displayClearButton={activeFilters?.location?.length > 0}
              onClearFilter={() => filterHandlers.clearGroup('location')}
            >
              <MultiSelectionFilter
                name="location"
                dataOptions={options.location}
                selectedValues={activeFilters.location}
                onChange={onChangeHandler}
              />
            </Accordion>
            <Accordion
              label={<FormattedMessage id="ui-rs.patronrequests.pickShelvingLocation" />}
              id="shelvingLocation"
              name="shelvingLocation"
              separator={false}
              header={FilterAccordionHeader}
              displayClearButton={activeFilters?.location?.length > 0}
              onClearFilter={() => filterHandlers.clearGroup('location')}
            >
              <MultiSelectionFilter
                name="shelvingLocation"
                dataOptions={options.shelvingLocation}
                selectedValues={activeFilters.shelvingLocation}
                onChange={onChangeHandler}
              />
            </Accordion>
          </>
        }
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.batch" />}
          id="batch"
          name="batch"
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={activeFilters?.batch?.length > 0}
          onClearFilter={() => filterHandlers.clearGroup('batch')}
        >
          <Selection
            name="batch"
            dataOptions={options.batch}
            value={activeFilters?.batch?.[0]}
            onChange={value => filterHandlers.state({ ...activeFilters, batch: [value] })}
            onFilter={(value, opts) => opts.filter(({ label }) => label.toLowerCase().includes(value.toLowerCase()))}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.serviceLevel" />}
          id="serviceLevel"
          name="serviceLevel"
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={activeFilters?.serviceLevel?.length > 0}
          onClearFilter={() => filterHandlers.clearGroup('serviceLevel')}
        >
          <MultiSelectionFilter
            name="serviceLevel"
            dataOptions={options.serviceLevel}
            selectedValues={activeFilters.serviceLevel}
            onChange={onChangeHandler}
          />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-rs.filter.serviceType" />}
          id="serviceType"
          name="serviceType"
          separator={false}
          header={FilterAccordionHeader}
          displayClearButton={activeFilters?.serviceType?.length > 0}
          onClearFilter={() => filterHandlers.clearGroup('serviceType')}
        >
          <MultiSelectionFilter
            name="serviceType"
            dataOptions={options.serviceType}
            selectedValues={activeFilters.serviceType}
            onChange={onChangeHandler}
          />
        </Accordion>
        <DateFilter
          accordionLabel={<FormattedMessage id="ui-rs.filter.dateSubmitted" />}
          activeFilters={activeFilters}
          filterHandlers={filterHandlers}
          hideNoDateSetCheckbox
          name="dateCreated"
        />
        <DateFilter
          accordionLabel={<FormattedMessage id="ui-rs.filter.dateNeeded" />}
          activeFilters={activeFilters}
          filterHandlers={filterHandlers}
          hideNoDateSetCheckbox
          name="dateNeeded"
        />
      </AccordionSet>
    </>
  );
};

export default Filters;
