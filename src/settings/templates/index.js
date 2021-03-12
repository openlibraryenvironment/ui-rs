import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { EntryManager } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import TemplateDetail from './TemplateDetail';
import TemplateForm from './TemplateForm';

const Templates = (props) => {
  const { context, templateContextLabel, tokens, tokensList } = props;

  // Massage shape of incoming template to fit nice form structure
  /*
   * TODO if we want to support localised email stuff at some point, this should be removed and we should
   * deal with a proper FieldArray for each localizedTemplate
   */
  const entryList = (props?.resources?.entries?.records || []).map(n => {
    const enTemplate = n.localizedTemplates?.find(t => t.locality === 'en') || {};
    return (
      {
        ...n,
        localizedTemplates: {
          en: enTemplate
        }
      }
    );
  });
  const sortedEntryList = sortBy(entryList, ['name']);

  const ContextualisedTemplateForm = (prps) => (
    <TemplateForm
      {...prps}
      tokens={tokens}
      tokensList={tokensList}
      templateContextLabel={templateContextLabel}
    />
  );

  return (
    <EntryManager
      {...props}
      parentMutator={props.mutator}
      entryList={sortedEntryList}
      detailComponent={TemplateDetail}
      paneTitle={props.label}
      entryLabel={props.label}
      entryFormComponent={ContextualisedTemplateForm}
      defaultEntry={{
        context,
        templateResolver: 'handlebars',
      }}
      nameKey="name"
      permissions={props.permissions}
      enableDetailsActionMenu
      editElement="both"
      templateContextLabel={props.templateContextLabel}
    />
  );
};

Templates.manifest = Object.freeze({
  entries: {
    type: 'okapi',
    path: 'rs/template',
    params: (_q, _p, _r, _s, props) => ({
      filters: `context=${props.context}`,
      sort: 'id'
    })
  },
});

Templates.propTypes = {
  context: PropTypes.string,
  mutator: PropTypes.object,
  resources: PropTypes.object,
  label: PropTypes.string,
  permissions: PropTypes.shape({
    put: PropTypes.string,
    post: PropTypes.string,
    delete: PropTypes.string
  })
};

export default stripesConnect(Templates);
