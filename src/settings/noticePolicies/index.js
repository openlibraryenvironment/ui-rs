import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { EntryManager } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import NoticePolicyDetail from './NoticePolicyDetail';
import NoticePolicyForm from './NoticePolicyForm';

const NoticePolicies = (props) => (
  <EntryManager
    {...props}
    parentMutator={props.mutator}
    entryList={sortBy((props.resources.entries || {}).records || [], ['name'])}
    detailComponent={NoticePolicyDetail}
    paneTitle={props.label}
    entryLabel={props.label}
    entryFormComponent={NoticePolicyForm}
    defaultEntry={{
      active: true,
    }}
    nameKey="name"
    permissions={{
      put: 'ui-rs.settings.notices',
      post: 'ui-rs.settings.notices',
      delete: 'ui-rs.settings.notices',
    }}
    enableDetailsActionMenu
    editElement="both"
  />
);

NoticePolicies.manifest = Object.freeze({
  entries: {
    type: 'okapi',
    path: 'rs/noticePolicies',
    max: 1000,
  }
});

NoticePolicies.propTypes = {
  mutator: PropTypes.object,
  resources: PropTypes.object,
  label: PropTypes.string,
};

export default stripesConnect(NoticePolicies);
