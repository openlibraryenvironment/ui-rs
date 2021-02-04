import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { EntryManager } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import NoticeDetail from './NoticeDetail';
import NoticeForm from './NoticeForm';

const Notices = (props) => {

  // Massage shape of incoming template to fit nice form structure
  /*
   * TODO if we want to support localised email stuff at some point, this should be removed and we should
   * deal with a proper FieldArray for each localizedTemplate
   */
  const entryList = (props?.resources?.entries?.records || []).map(n => {
    const enTemplate = n.localizedTemplates?.find(t => t.locality === "en") || {}
    return (
      {
        ...n,
        localizedTemplates: {
          en: enTemplate
        }
      }
    );
  })
  const sortedEntryList = sortBy(entryList, ['name'])

  return (
    <EntryManager
      {...props}
      parentMutator={props.mutator}
      entryList={sortedEntryList}
      detailComponent={NoticeDetail}
      paneTitle={props.label}
      entryLabel={props.label}
      entryFormComponent={NoticeForm}
      defaultEntry={{
        templateResolver: 'handlebars',
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
};

Notices.manifest = Object.freeze({
  entries: {
    type: 'okapi',
    path: 'rs/template'
  },
});

Notices.propTypes = {
  mutator: PropTypes.object,
  resources: PropTypes.object,
  label: PropTypes.string,
};

export default stripesConnect(Notices);
