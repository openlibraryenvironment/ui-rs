import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';
import { Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';

import { Button, Pane, Checkbox } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { ActionList, FormModal, generateKiwtQuery } from '@k-int/stripes-kint-components';
import { useOkapiQuery, useIntlCallout } from '@projectreshare/stripes-reshare';
import PatronProfileForm from './PatronProfileForm';

const HostLMSPatronProfiles = () => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const sendCallout = useIntlCallout();

  const [formModal, setFormModal] = useState(false);

  const { data: locations } = useOkapiQuery('rs/hostLMSPatronProfiles', {
    searchParams: generateKiwtQuery({ sort: [{ path: 'name' }], stats: false, max: 1000 }, {}),
  });

  const { mutateAsync: putLocation } = useMutation(
    ['ui-rs', 'putPatronProfile'],
    async (data) => {
      await ky.put(`rs/hostLMSPatronProfiles/${data.id}`, { json: data }).json();
      queryClient.invalidateQueries('rs/hostLMSPatronProfiles');
    }
  );

  const { mutateAsync: postLocation } = useMutation(
    ['ui-rs', 'postPatronProfile'],
    async (data) => {
      await ky.post('rs/hostLMSPatronProfiles', { json: data }).json();
      queryClient.invalidateQueries('rs/hostLMSPatronProfiles');
    }
  );

  const { mutateAsync: deleteLocation } = useMutation(
    ['ui-rs', 'deletePatronProfile'],
    async (data) => {
      await ky.delete(`rs/hostLMSPatronProfiles/${data.id}`, { json: data })
        .catch(error => {
          error.response.json()
            .then(resp => {
              // This simultaneously checks the error type and that we have a sensible array of linked ids
              if (resp.linkedPatronRequests?.length) {
                sendCallout('ui-rs.settings.lmsloc.linkedPRs', 'error', { prs: resp.linkedPatronRequests?.join(', ') });
              }
            });
        });
      queryClient.invalidateQueries('rs/hostLMSPatronProfiles');
    }
  );

  const actionAssigner = () => {
    return ([
      {
        name: 'edit',
        callback: (data) => putLocation(data),
        label: <FormattedMessage id="ui-rs.edit" />,
        icon: 'edit',
      },
      {
        name: 'delete',
        callback: (data) => deleteLocation(data),
        label: <FormattedMessage id="ui-rs.delete" />,
        icon: 'trash',
      },
    ]);
  };

  const fieldComponents = {
    canCreateRequests: ({ ...fieldProps }) => {
      return (
        <Field
          {...fieldProps}
          component={Checkbox}
          type="checkbox"
          fullWidth
          marginBottom0
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
        paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.hostLMSPatronProfiles" />}
      >
        <ActionList
          actionAssigner={actionAssigner}
          columnMapping={{
            name: <FormattedMessage id="ui-rs.settings.lmspprf.patronProfile" />,
            code: <FormattedMessage id="ui-rs.settings.lmspprf.code" />,
            canCreateRequests: <FormattedMessage id="ui-rs.settings.lmspprf.canCreateRequests" />,
          }}
          contentData={locations}
          editableFields={{
            code: () => false
          }}
          fieldComponents={fieldComponents}
          formatter={{
            canCreateRequests: rec => {
              switch (rec.canCreateRequests) {
                case true: return '✓';
                case false: return '✗';
                default: return '';
              }
            }
          }}
          hideCreateButton
          visibleFields={['name', 'code', 'canCreateRequests']}
        />
      </Pane>
      <FormModal
        initialValues={{ canCreateRequests: false }}
        onSubmit={async (data, form) => {
          try {
            await postLocation(data);
            form.restart();
            setFormModal(false);
            return undefined;
          } catch (e) {
            const res = await e?.response?.json();
            let message = res.message;
            if (message != null) {
              if (message.endsWith('must be unique')) {
                  message = <FormattedMessage id="ui-rs.settings.lmspprf.alreadyExists" />;
              }
            }
            return { [FORM_ERROR]: message ?? e.message };
          }
        }}
        modalProps={{
          onClose: () => setFormModal(false),
          open: formModal,
          size: 'small',
          label: <FormattedMessage id="ui-rs.settings.lmspprf.createNew" />,
        }}
      >
        <PatronProfileForm />
      </FormModal>
    </>
  );
};

export default HostLMSPatronProfiles;
