import React, { useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import { useOkapiQuery } from '@projectreshare/stripes-reshare';

import { REFDATA_ENDPOINT } from '../../constants/endpoints';

const CUST_OPTIONS = ['cannotSupplyReasons', 'loanConditions', 'customIdentifiersScheme'];

const CustomISO18626 = () => {
  const intl = useIntl();
  const stripes = useStripes();
  const [categoryId, setCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState(null);

  const { data: refdataValues = [] } = useOkapiQuery(REFDATA_ENDPOINT, { searchParams: { max: '500' } });

  const ConnectedControlledVocab = useMemo(
    () => stripes.connect(ControlledVocab),
    [stripes]
  );

  const filteredList = refdataValues.filter(obj => CUST_OPTIONS.includes(obj.desc));

  const onChangeCategory = (e) => {
    const selected = refdataValues.find(obj => obj.id === e.target.value);
    setCategoryId(e.target.value);
    setCategoryName(selected?.desc);
  };

  const rowFilter = (
    <Select
      dataOptions={[
        { value: 'empty', label: intl.formatMessage({ id: 'ui-rs.settings.customiseListSelect' }) },
        ...filteredList.map(c => ({
          value: c.id,
          label: intl.formatMessage({ id: `ui-rs.settings.customiseListSelect.${c.desc}`, defaultMessage: c.desc }),
        })),
      ]}
      id="categorySelect"
      label={<FormattedMessage id="ui-rs.settings.customiseList" />}
      name="categorySelect"
      onChange={onChangeCategory}
    />
  );

  return (
    <ConnectedControlledVocab
      stripes={stripes}
      actuatorType="refdata"
      baseUrl={`${REFDATA_ENDPOINT}/${categoryId}`}
      columnMapping={{
        label: intl.formatMessage({ id: 'ui-rs.settings.value' }),
        actions: intl.formatMessage({ id: 'ui-rs.settings.actions' }),
      }}
      dataKey={undefined}
      formatter={{ label: r => intl.formatMessage({ id: `ui-rs.settings.customiseListSelect.${categoryName}.${r.value}`, defaultMessage: r.label }) }}
      hiddenFields={['lastUpdated', 'numberOfObjects']}
      id="custom-iso18626"
      label={<FormattedMessage id="ui-rs.settings.customISO18626" />}
      labelSingular={intl.formatMessage({ id: 'ui-rs.settings.value' })}
      listSuppressor={() => !categoryId}
      nameKey="label"
      objectLabel={<FormattedMessage id="ui-rs.settings.values" />}
      records="values"
      rowFilter={rowFilter}
      sortby="label"
      visibleFields={['label']}
    />
  );
};

export default CustomISO18626;
