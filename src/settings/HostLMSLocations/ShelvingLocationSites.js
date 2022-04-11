import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useMutation, useQueryClient } from 'react-query';
import { Field } from 'react-final-form';
import { FORM_ERROR } from 'final-form';
import { useHistory } from 'react-router';

import { Button, Pane, TextField } from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';
import { ActionList, FormModal } from '@k-int/stripes-kint-components';
import { useIntlCallout } from '@reshare/stripes-reshare';
import ShelvingLocationSiteForm from './ShelvingLocationSiteForm';

const ShelvingLocationSites = ({ location }) => {
  const ky = useOkapiKy();
  const queryClient = useQueryClient();
  const sendCallout = useIntlCallout();
  const history = useHistory();

  const [formModal, setFormModal] = useState(false);

  const { mutateAsync: putSite } = useMutation(
    ['ui-rs', 'putShelvingLocationSite'],
    async (data) => {
      await ky.put(`rs/shelvingLocationSites/${data.id}`, { json: data }).json();
      queryClient.invalidateQueries('rs/shelvingLocationSites');
      queryClient.invalidateQueries('rs/hostLMSLocations');
    }
  );

  const { mutateAsync: postSite } = useMutation(
    ['ui-rs', 'postShelvingLocationSite'],
    async (data) => {
      await ky.post('rs/shelvingLocationSites', { json: data }).json();
      queryClient.invalidateQueries('rs/shelvingLocationSites');
      queryClient.invalidateQueries('rs/hostLMSLocations');
    }
  );

  const { mutateAsync: deleteSite } = useMutation(
    ['ui-rs', 'deleteShelvingLocationSite'],
    async (data) => {
      await ky.delete(`rs/shelvingLocationSites/${data.id}`, { json: data })
        .catch(error => {
          error.response.json()
            .then(resp => {
              // This simultaneously checks the error type and that we have a sensible array of linked ids
              if (resp.linkedPatronRequests?.length) {
                sendCallout('ui-rs.settings.lmsloc.linkedPRs', 'error', { prs: resp.linkedPatronRequests?.join(', ') });
              }
            });
        });
      queryClient.invalidateQueries('rs/shelvingLocationSites');
      queryClient.invalidateQueries('rs/hostLMSLocations');
    }
  );


  if (!Array.isArray(location?.sites)) return null;
  const sites = location.sites.map(site => ({
    ...site,
    code: site.shelvingLocation.code,
    name: site.shelvingLocation.name,
  }));

  const actionAssigner = () => {
    return ([
      { name: 'edit', label: <FormattedMessage id="ui-rs.edit" />, icon: 'edit' },
      { name: 'delete', label: <FormattedMessage id="ui-rs.delete" />, icon: 'trash' },
    ]);
  };

  const actionCalls = {
    edit: (data) => putSite(data),
    delete: (data) => deleteSite(data)
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
        dismissible
        onClose={() => history.push({ search: '' })}
        lastMenu={
          <Button
            marginBottom0
            onClick={() => setFormModal(true)}
          >
            <FormattedMessage id="stripes-kint-components.create" />
          </Button>
        }
        paneTitle={<FormattedMessage id="ui-rs.settings.lmsloc.overridesFor" values={{ location: location.name }} />}
      >
        <ActionList
          actionAssigner={actionAssigner}
          actionCalls={actionCalls}
          columnMapping={{
            name: <FormattedMessage id="ui-rs.settings.lmsshlv.shelvingLocation" />,
            code: <FormattedMessage id="ui-rs.settings.lmsshlv.code" />,
            supplyPreference: <FormattedMessage id="ui-rs.settings.lmsloc.supplyPreference" />,
          }}
          contentData={sites}
          editableFields={{
            code: () => false,
            name: () => false,
          }}
          fieldComponents={fieldComponents}
          hideCreateButton
          visibleFields={['name', 'code', 'supplyPreference']}
        />
      </Pane>
      <FormModal
        onSubmit={async (data, form) => {
          try {
            await postSite({ ...data, location: location.id });
            form.restart();
            setFormModal(false);
            return undefined;
          } catch (e) {
            const res = await e?.response?.json();
            return { [FORM_ERROR]: res.message ?? e.message };
          }
        }}
        modalProps={{
          onClose: () => setFormModal(false),
          open: formModal,
          size: 'small',
          label: <FormattedMessage id="ui-rs.settings.lmsloc.createOverrideFor" values={{ location: location.name }} />,
        }}
      >
        <ShelvingLocationSiteForm location={location} />
      </FormModal>
    </>
  );
};

export default ShelvingLocationSites;
