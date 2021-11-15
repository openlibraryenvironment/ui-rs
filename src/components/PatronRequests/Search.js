import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Icon, SearchField } from '@folio/stripes/components';
import AppNameContext from '../../AppNameContext';

const Search = ({ resetAll, searchHandlers, searchValue, searchChanged, filterChanged }) => {
  const intl = useIntl();
  const appName = useContext(AppNameContext);
  const searchableIndexes = [
    { label: 'allFields', value: '' },
    { label: 'id', value: 'id' },
    { label: 'hrid', value: 'hrid' },
    { label: 'requesterGivenName', value: 'patronGivenName' },
    { label: 'requesterSurname', value: 'patronSurname' },
    { label: 'title', value: 'title' },
    { label: 'author', value: 'author' },
    { label: 'issn', value: 'issn' },
    { label: 'isbn', value: 'isbn' },
    { label: 'itemBarcode', value: 'volumes.itemId' },
  ].map(x => ({
    label: intl.formatMessage({ id: `ui-rs.index.${x.label}` }),
    value: x.value,
  }));
  if (appName === 'supply') searchableIndexes.splice(3, 2);

  return (
    <>
      <SearchField
        autoFocus
        name="query"
        onChange={searchHandlers.query}
        onClear={searchHandlers.reset}
        searchableIndexes={searchableIndexes}
        value={searchValue.query}
      />
      <Button
        buttonStyle="primary"
        disabled={!searchValue.query || searchValue.query === ''}
        fullWidth
        type="submit"
      >
        <FormattedMessage id="stripes-smart-components.search" />
      </Button>
      <Button
        buttonStyle="none"
        disabled={!(filterChanged || searchChanged)}
        id="clickable-reset-all"
        fullWidth
        onClick={resetAll}
      >
        <Icon icon="times-circle-solid">
          <FormattedMessage id="stripes-smart-components.resetAll" />
        </Icon>
      </Button>
    </>
  );
};

export default Search;
