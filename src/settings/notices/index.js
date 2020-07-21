import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { EntryManager } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import NoticeDetail from './NoticeDetail';
import NoticeForm from './NoticeForm';

const Notices = (props) => (
  <EntryManager
    {...props}
    parentMutator={props.mutator}
    entryList={sortBy((props.resources.entries || {}).records || [], ['name'])}
    detailComponent={NoticeDetail}
    paneTitle={props.label}
    entryLabel={props.label}
    entryFormComponent={NoticeForm}
    defaultEntry={{
      active: true,
      outputFormats: ['text/html'],
      templateResolver: 'mustache',
    }}
    nameKey="name"
    permissions={{
      put: 'settings.rs.notices',
      post: 'settings.rs.notices',
      delete: 'settings.rs.notices',
    }}
    enableDetailsActionMenu
    editElement="both"
  />
);

Notices.manifest = Object.freeze({
  entries: {
    type: 'okapi',
    path: 'templates',
    records: 'templates',
    params: {
      query: 'cql.allRecords=1 AND name=""',
    },
    recordsRequired: 50,
    perRequest: 50,
  },
});

Notices.propTypes = {
  mutator: PropTypes.object,
  resources: PropTypes.object,
  label: PropTypes.string,
};

export default stripesConnect(Notices);
