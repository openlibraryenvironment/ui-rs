import React from 'react';
import { PaneSet } from '@folio/stripes/components';
import { stripesConnect, withStripes } from '@folio/stripes/core';
import ViewPatronRequest from '../components/ViewPatronRequest';

export default () => {
  const ConnectedViewPatronRequest = stripesConnect(withStripes(ViewPatronRequest));
  // This is going to be tedious to supply the API for:
  // https://github.com/folio-org/stripes-smart-components/blob/master/lib/SearchAndSort/SearchAndSort.js#L766
  return (
    <PaneSet>
      <ConnectedViewPatronRequest />
    </PaneSet>
  );
};
