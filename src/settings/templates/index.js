import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';
import { EntryManager } from '@folio/stripes/smart-components';
import { stripesConnect } from '@folio/stripes/core';

import TemplateDetail from './TemplateDetail';
import TemplateForm from './TemplateForm';
import { TEMPLATES_ENDPOINT } from '../../constants/endpoints';

const Templates = (props) => {
  const { context, templateContextLabel, tokens, tokensList } = props;

  // Massage shape of incoming template to fit nice form structure
  /*
   * TODO if we want to support localised email stuff at some point, this should be removed and we should
   * deal with a proper FieldArray for each localizedTemplate
   */
  // IMPORTANT this must remain using stripes-connect until such time as we replace EntryManager, as that requires stripes-connect stuff
  // Eventually we want to replace this with 'useTemplates' from @k-int/stripes-kint-components
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

  const ContextualisedTemplateForm = useCallback((prps) => (
    <TemplateForm
      {...prps}
      tokens={tokens}
      tokensList={tokensList}
      templateContextLabel={templateContextLabel}
    />
  ), [tokens, tokensList, templateContextLabel]);

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
        localizedTemplates: {
          en: {
            locality: 'en',
            template: {
              header: '',
              templateBody: ''
            }
          }
        }
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
    path: TEMPLATES_ENDPOINT,
    params: (_q, _p, _r, _s, props) => ({
      filters: `context=${props.context}`,
      max: 1000,
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
