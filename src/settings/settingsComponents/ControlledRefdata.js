import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { stripesConnect, useStripes } from '@folio/stripes/core';

const ConnectedControlledVocab = stripesConnect(ControlledVocab);

const ControlledRefdata = ({ resources, category, ...rest }) => {
  const intl = useIntl();
  const stripes = useStripes();

  const refdataValues = resources?.refdatavalues?.records;
  const categoryId = refdataValues?.find(obj => obj.desc === category)?.id;
  if (!categoryId) return null;

  return (<ConnectedControlledVocab
    actuatorType="refdata"
    baseUrl={`rs/refdata/${categoryId}`}
    columnMapping={{
      label: intl.formatMessage({ id: 'ui-rs.settings.value' }),
      actions: intl.formatMessage({ id: 'ui-rs.settings.actions' }),
    }}
    hiddenFields={['lastUpdated', 'numberOfObjects']}
    labelSingular={intl.formatMessage({ id: 'ui-rs.settings.value' })}
    nameKey="label"
    objectLabel={<FormattedMessage id="ui-rs.settings.values" />}
    records="values"
    sortby="label"
    stripes={stripes}
    visibleFields={['label']}
    {...rest}
  />);
};

ControlledRefdata.manifest = {
  // just needed for the category id
  refdatavalues: {
    type: 'okapi',
    path: 'rs/refdata',
    params: {
      max: '500',
    },
  }
};

export default stripesConnect(ControlledRefdata);
