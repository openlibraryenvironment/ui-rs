import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQuery } from 'react-query';

import { Field } from 'react-final-form';

import { Pane, Select, Spinner } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import { ActionList, generateKiwtQuery } from '@k-int/stripes-kint-components';

const HostLMSLocations = () => {
  const ky = useOkapiKy();

  const { data: locations } = useQuery(
    ['ui-rs', 'settings', 'HostLMSLocations', 'getLocations'],
    () => ky(`rs/hostLMSLocations${generateKiwtQuery({sort: 'name', stats: false, max: 100}, {})}`).json()
  );

  const branchPath = `rs/directoryEntry${generateKiwtQuery(
    {
      filterKeys: {
        entryType: 'type.value',
        entryStatus: 'status.value'
      },
      max: 100,
      sort: 'name',
      stats: false
    },
    {
      filters: 'entryType.branch, entryStatus.managed'
    }
  )}`;

  const { data: branchLocations, isLoading: branchLocationsLoading } = useQuery(
    ['ui-rs', 'settings', 'HostLMSLocations', 'getBranchLocations'],
    () => ky(branchPath).json()
  );

  const dirOptions = branchLocations?.reduce((acc, cur) => ([...acc, { value: cur.id, label: cur.name }]), [{"": ""}]);
  // This is fine for now but we should probably just expand the dir entry name on the record
  const dirLookup = dirOptions?.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.label }), {});


  const { mutateAsync: putLocation } = useMutation(
    ['ui-rs', 'settings', 'HostLMSLocations', 'putLocations'],
    async (data) => ky.put(`rs/hostLMSLocations/${data.id}`, { json: data }).json()
  );

  console.log("Locations: %o", locations)

  const actionAssigner = () => {
    return ([
      { name: 'edit', label: <FormattedMessage id="ui-rs.edit" />, icon: 'edit' },
    ]);
  };

  const actionCalls = {
    edit: (data) => putLocation(data)
  };

  const fieldComponents = {
    correspondingDirectoryEntry: ({ ...fieldProps }) => {
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


  return (
    <Pane
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.hostLMSLocations" />}
    >
      <ActionList
        actionAssigner={actionAssigner}
        actionCalls={actionCalls}
        columnMapping={{
          name: <FormattedMessage id="ui-rs.settings.lmsloc.hostLMSLocation" />,
          supplyPreference: <FormattedMessage id="ui-rs.settings.lmsloc.supplyPreference" />,
          correspondingDirectoryEntry: <FormattedMessage id="ui-rs.settings.lmsloc.correspondingDirectoryEntry" />
        }}
        contentData={locations}
        editableFields={{
          name: () => false
        }}
        fieldComponents={fieldComponents}
        formatter={{
          correspondingDirectoryEntry: rec => {
            const id = rec?.correspondingDirectoryEntry?.id;
            if (!id) return '';
            if (branchLocationsLoading) {
              return <Spinner/>;
            }
            return dirLookup[id] ?? id;
          }
        }}
        visibleFields={['name', 'supplyPreference', 'correspondingDirectoryEntry']}
      />
    </Pane>
  );
};

export default HostLMSLocations;
