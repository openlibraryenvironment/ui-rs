import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { Select } from '@folio/stripes/components';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { stripesConnect, useStripes } from '@folio/stripes/core';

const ConnectedControlledVocab = stripesConnect(ControlledVocab);
const actionSuppressor = { edit: () => false, delete: () => true };
const HostLMSLocations = ({ resources }) => {
  const intl = useIntl();
  const stripes = useStripes();

  if (!resources?.branchLocations?.hasLoaded) return null;
  const dirOptions = resources.branchLocations.records.reduce((acc, cur) => ([...acc, { value: cur.id, label: cur.name }]), []);
  const dirLookup = dirOptions.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.label }), {});

  const fieldComponents = {
    correspondingDirectoryEntry: ({ fieldProps }) => {
      return (
        <Field
          {...fieldProps}
          component={Select}
          dataOptions={dirOptions}
          format={v => v?.id ?? ''}
          parse={v => ({ id: v })}
          fullWidth
          marginBottom0
        />
      );
    },
  };

  const formatter = {
    correspondingDirectoryEntry: rec => {
      const id = rec?.correspondingDirectoryEntry?.id;
      if (!id) return '';
      return dirLookup[id] ?? id;
    }
  };

  return (<ConnectedControlledVocab
    baseUrl="rs/hostLMSLocations"
    canCreate={false}
    columnMapping={{
      supplyPreference: intl.formatMessage({ id: 'ui-rs.settings.lmsloc.supplyPreference' }),
      correspondingDirectoryEntry: intl.formatMessage({ id: 'ui-rs.settings.lmsloc.correspondingDirectoryEntry' }),
      actions: intl.formatMessage({ id: 'ui-rs.settings.actions' }),
    }}
    formType="final-form"
    hiddenFields={['lastUpdated', 'numberOfObjects']}
    readOnlyFields={['name']}
    visibleFields={['name', 'supplyPreference', 'correspondingDirectoryEntry']}
    label={intl.formatMessage({ id: 'ui-rs.settings.settingsSection.hostLMSLocations' })}
    labelSingular={intl.formatMessage({ id: 'ui-rs.settings.lmsloc.hostLMSLocation' })}
    limitParam="max"
    objectLabel={<FormattedMessage id="ui-rs.settings.values" />}
    sortby="name"
    actionSuppressor={actionSuppressor}
    fieldComponents={fieldComponents}
    formatter={formatter}
    stripes={stripes}
  />);
};

HostLMSLocations.manifest = {
  branchLocations: {
    type: 'okapi',
    path: 'rs/directoryEntry?filters=(type.value%3D%3Dbranch)&filters=status.value%3D%3Dmanaged&max=1000',
  }
};

export default stripesConnect(HostLMSLocations);
