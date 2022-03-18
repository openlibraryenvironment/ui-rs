import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';
import { Field } from 'react-final-form';

import { Button, Pane, TextField } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { ActionList, FormModal, generateKiwtQuery } from '@k-int/stripes-kint-components';
import { useOkapiQuery, useIntlCallout } from '@reshare/stripes-reshare';
import ShelvingLocationForm from './ShelvingLocationForm';

const HostLMSShelvingLocations = () => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const sendCallout = useIntlCallout();

  const [formModal, setFormModal] = useState(false);

  const { data: locations } = useOkapiQuery('rs/shelvingLocations', {
    searchParams: generateKiwtQuery({ sort: [{ path: 'name' }], stats: false, max: 1000 }, {}),
  });

  const { mutateAsync: putLocation } = useMutation(
    ['ui-rs', 'putShelvingLocation'],
    async (data) => {
      await ky.put(`rs/shelvingLocations/${data.id}`, { json: data }).json();
      queryClient.invalidateQueries('rs/shelvingLocations');
    }
  );

  const { mutateAsync: postLocation } = useMutation(
    ['ui-rs', 'postShelvingLocation'],
    async (data) => {
      await ky.post('rs/shelvingLocations', { json: data }).json();
      queryClient.invalidateQueries('rs/shelvingLocations');
    }
  );

  const { mutateAsync: deleteLocation } = useMutation(
    ['ui-rs', 'deleteShelvingLocation'],
    async (data) => {
      await ky.delete(`rs/shelvingLocations/${data.id}`, { json: data })
        .catch(error => {
          error.response.json()
            .then(resp => {
              // This simultaneously checks the error type and that we have a sensible array of linked ids
              if (resp.linkedPatronRequests?.length) {
                sendCallout('ui-rs.settings.lmsloc.linkedPRs', 'error', { prs: resp.linkedPatronRequests?.join(', ') });
              }
            });
        });
      queryClient.invalidateQueries('rs/shelvingLocations');
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
            onClick={() => setFormModal(true)}
          >
            <FormattedMessage id="stripes-kint-components.create" />
          </Button>
        }
        paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.hostLMSShelvingLocations" />}
      >
        <ActionList
          actionAssigner={actionAssigner}
          actionCalls={actionCalls}
          columnMapping={{
            name: <FormattedMessage id="ui-rs.settings.lmsshlv.shelvingLocation" />,
            supplyPreference: <FormattedMessage id="ui-rs.settings.lmsloc.supplyPreference" />,
          }}
          contentData={locations}
          editableFields={{
            name: () => false
          }}
          fieldComponents={fieldComponents}
          hideCreateButton
          visibleFields={['name', 'supplyPreference']}
        />
      </Pane>
      <FormModal
        onSubmit={data => {
          postLocation(data);
          setFormModal(false);
        }}
        modalProps={{
          onClose: () => setFormModal(false),
          open: formModal,
          size: 'small'
        }}
      >
        <ShelvingLocationForm />
      </FormModal>
    </>
  );
};

export default HostLMSShelvingLocations;
