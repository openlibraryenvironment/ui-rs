import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { Field } from 'react-final-form';

import { Button, Pane, Select, Spinner, TextField } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { ActionList, FormModal, generateKiwtQuery } from '@k-int/stripes-kint-components';
import { useOkapiQueryConfig, useIntlCallout } from '@reshare/stripes-reshare';
import HostLMSLocationForm from './HostLMSLocationForm';

const HostLMSLocations = () => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const sendCallout = useIntlCallout();

  const [hostLMSFormModal, setHostLMSFormModal] = useState(false);

  // Not caching locations as they are autopopulated and we want to see the latest whenever we navigate here
  const locationQueryConfig = useOkapiQueryConfig('rs/hostLMSLocations', {
    searchParams: generateKiwtQuery({ sort: [{ path: 'name' }], stats: false, max: 1000 }, {}),
  });
  const { data: locations } = useQuery(locationQueryConfig);

  const branchParams = generateKiwtQuery(
    {
      max: 1000,
      filters: [
        { path: 'type.value', value: 'branch' },
        { path: 'status.value', value: 'managed' }
      ],
      sort: [{ path: 'name' }],
      stats: false
    },
    {}
  );
  const branchQueryConfig = useOkapiQueryConfig('rs/directoryEntry', {
    searchParams: branchParams,
    staleTime: 1 * 60 * 1000 // can set this longer once we invalidate in ui-directory
  });
  const { data: branchLocations, isLoading: branchLocationsLoading } = useQuery(branchQueryConfig);

  const dirOptions = branchLocations?.reduce((acc, cur) => ([...acc, { value: cur.id, label: cur.name }]), [{ '': '' }]);
  // This is fine for now but we should probably just expand the dir entry name on the record
  const dirLookup = dirOptions?.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.label }), {});



  const { mutateAsync: putLocation } = useMutation(
    ['ui-rs', 'settings', 'HostLMSLocations', 'putLocations'],
    async (data) => {
      await ky.put(`rs/hostLMSLocations/${data.id}`, { json: data }).json();
      queryClient.invalidateQueries(locationQueryConfig.queryKey);
    }
  );

  const { mutateAsync: postLocation } = useMutation(
    ['ui-rs', 'settings', 'HostLMSLocations', 'postLocations'],
    async (data) => {
      await ky.post('rs/hostLMSLocations', { json: data }).json();
      queryClient.invalidateQueries(locationQueryConfig.queryKey);
    }
  );

  const { mutateAsync: deleteLocation } = useMutation(
    ['ui-rs', 'settings', 'HostLMSLocations', 'deleteLocation'],
    async (data) => {
      await ky.delete(`rs/hostLMSLocations/${data.id}`, { json: data })
        .catch(error => {
          error.response.json()
            .then(resp => {
              // This simultaneously checks the error type and that we have a sensible array of linked ids
              if (resp.linkedPatronRequests?.length) {
                sendCallout('ui-rs.settings.lmsloc.linkedPRs', 'error', { prs: resp.linkedPatronRequests?.join(', ') });
              }
            });
        });
      queryClient.invalidateQueries(locationQueryConfig.queryKey);
    }
  );

  const actionAssigner = () => {
    return ([
      { name: 'edit', label: <FormattedMessage id="ui-rs.edit" />, icon: 'edit' },
      { name: 'delete', label: <FormattedMessage id="ui-rs.delete" />, icon: 'trash' },
    ]);
  };

  const actionCalls = {
    edit: (data) => putLocation(data),
    delete: (data) => deleteLocation(data)
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
    supplyPreference: ({ ...fieldProps }) => {
      return (
        <Field
          {...fieldProps}
          component={TextField}
          type="number"
          fullWidth
          marginBottom0
          parse={v => v}
        />
      );
    }
  };

  return (
    <>
      <Pane
        defaultWidth="fill"
        lastMenu={
          <Button
            marginBottom0
            onClick={() => setHostLMSFormModal(true)}
          >
            <FormattedMessage id="stripes-kint-components.create" />
          </Button>
        }
        paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.hostLMSLocations" />}
      >
        <ActionList
          actionAssigner={actionAssigner}
          actionCalls={actionCalls}
          columnMapping={{
            name: <FormattedMessage id="ui-rs.settings.lmsloc.hostLMSLocation" />,
            code: <FormattedMessage id="ui-rs.settings.lmsloc.code" />,
            supplyPreference: <FormattedMessage id="ui-rs.settings.lmsloc.supplyPreference" />,
            correspondingDirectoryEntry: <FormattedMessage id="ui-rs.settings.lmsloc.correspondingDirectoryEntry" />
          }}
          contentData={locations}
          editableFields={{
            code: () => false
          }}
          fieldComponents={fieldComponents}
          formatter={{
            correspondingDirectoryEntry: rec => {
              const id = rec?.correspondingDirectoryEntry?.id;
              if (!id) return '';
              if (branchLocationsLoading) {
                return <Spinner />;
              }
              return dirLookup[id] ?? id;
            }
          }}
          hideCreateButton
          visibleFields={['name', 'code', 'supplyPreference', 'correspondingDirectoryEntry']}
        />
      </Pane>
      <FormModal
        onSubmit={data => {
          postLocation(data);
          setHostLMSFormModal(false);
        }}
        modalProps={{
          onClose: () => setHostLMSFormModal(false),
          open: hostLMSFormModal,
          size: 'small'
        }}
      >
        <HostLMSLocationForm dirOptions={dirOptions} />
      </FormModal>
    </>
  );
};

export default HostLMSLocations;
