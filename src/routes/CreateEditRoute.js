import React, { useContext } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'react-final-form';
import { useMutation, useQueryClient } from 'react-query';
import { Prompt, useLocation } from 'react-router-dom';
import { Button, Pane, Paneset, PaneMenu, KeyValue } from '@folio/stripes/components';
import { CalloutContext, useOkapiKy } from '@folio/stripes/core';
import { useOkapiQuery, usePerformAction } from '@projectreshare/stripes-reshare';
import PatronRequestForm from '../components/PatronRequestForm';

const CREATE = 'create';
const EDIT = 'update';
const REREQUEST = 'rerequest';

const handleSISelect = (args, state, tools) => {
  Object.entries(args[0]).forEach(([field, value]) => tools.changeValue(state, field, () => value));
};

const CreateEditRoute = props => {
  const { history, match } = props;
  const id = match.params?.id;
  const performAction = usePerformAction(id);
  const routerLocation = useLocation();
  const callout = useContext(CalloutContext);
  const intl = useIntl();
  const queryClient = useQueryClient();
  const okapiKy = useOkapiKy();

  const locQuery = useOkapiQuery('directory/entry', { searchParams: '?filters=(type.value%3D%3Dinstitution)%7C%7C(tags.value%3Di%3Dpickup)&filters=status.value%3D%3Dmanaged&perPage=100' });
  const reqQuery = useOkapiQuery(`rs/patronrequests/${id}`, { enabled: !!id });

  const updater = useMutation({
    mutationFn: (updated) => okapiKy
      .put(`rs/patronrequests/${id}`, { json: updated })
      .then((res) => res.data),
    onSuccess: async () => {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await queryClient.invalidateQueries(`rs/patronrequests/${id}`);
      await queryClient.invalidateQueries('rs/patronrequests');
      history.goBack();
    },
    onError: async (err) => {
      callout.sendCallout({ type: 'error',
        message: (
          <KeyValue
            label={<FormattedMessage id="ui-rs.update.error" />}
            value={err.response?.statusText || ''}
          />
        ) });
    },
  });

  const creator = useMutation({
    mutationFn: (newRecord) => okapiKy
      .post('rs/patronrequests', { json: newRecord }),
    onSuccess: async (res) => {
      const created = await res.json();
      // When creating a new request we need to delay before redirecting to the request's page to
      // give the server some time to resolve the requesting institution from the symbol and generate
      // an appropriate ID.
      await new Promise(resolve => setTimeout(resolve, 3000));
      // We want to go to the new record but we also want it to be easy to return to where we were,
      // hence use of history.replace rather than history.push -- the create form turns into the
      // created record.
      history.replace(`view/${created.id}${routerLocation.search}`);
    },
    onError: async (err) => {
      callout.sendCallout({ type: 'error',
        message: (
          <KeyValue
            label={<FormattedMessage id="ui-rs.create.error" />}
            value={err.response?.statusText || ''}
          />
        ) });
    },
  });

  if (!locQuery.isSuccess) return null;
  // locations are where rec.type.value is 'branch' and there is a tag in rec.type.tags where the value is 'pickup'
  // and are formatted for the Select component as { value: lmsLocationCode, label: name }
  const locations = locQuery.data
    .filter(rec => rec?.type?.value === 'branch'
      && rec?.tags.reduce((acc, cur) => acc || cur?.value === 'pickup', false))
    .reduce((acc, cur) => ([...acc, { value: cur.slug, label: cur.name }]), []);

  const validRequesterRecords = locQuery.data
    .filter(rec => rec?.type?.value === 'institution' && rec?.symbols?.[0]?.authority?.symbol);
  if (!validRequesterRecords?.[0]) throw new Error('Cannot resolve symbol to create requests as');
  const requesters = validRequesterRecords.reduce((acc, cur) => ([...acc, { value: `${cur.symbols[0].authority.symbol}:${cur.symbols[0].symbol}`, label: cur.name }]), []);

  const op = id ? (routerLocation.pathname.endsWith('rerequest') ? REREQUEST : EDIT) : CREATE;
  let initialValues = {};
  if (id) {
    if (!reqQuery.isSuccess) return null;
    const record = reqQuery.data;
    initialValues = { ...record,
      formattedDateCreated: (
        intl.formatDate(record.dateCreated) + ', ' + intl.formatTime(record.dateCreated)
      ) };
  }

  const submit = async newRecord => {
    if (op === EDIT) return updater.mutateAsync(newRecord);
    else if (op === REREQUEST) {
      const res = await performAction('rerequest', newRecord,
        { error: 'stripes-reshare.actions.rerequest.error', success: 'stripes-reshare.actions.rerequest.success' });
      if (res.json && (await res.json()).status === true) {
        const refetched = await reqQuery.refetch();
        const newReqId = refetched.data?.succeededBy?.id;
        // When creating a new request we need to delay before redirecting to the request's page to
        // give the server some time to resolve the requesting institution from the symbol and generate
        // an appropriate ID.
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (newReqId) history.replace(`../${newReqId}${routerLocation.search}`);
      }
      return res;
    }
    const baseRecord = {
      requestingInstitutionSymbol: requesters[0].value,
      isRequester: true
    };
    return creator.mutateAsync({ ...baseRecord, ...newRecord });
  };

  return (
    <Paneset>
      <Form onSubmit={submit} initialValues={initialValues} mutators={{ handleSISelect }} keepDirtyOnReinitialize>
        {({ form, handleSubmit, pristine, submitting, submitSucceeded }) => (
          <Pane
            defaultWidth="100%"
            centerContent
            onClose={history.goBack}
            dismissible
            lastMenu={
              <PaneMenu>
                <Button
                  id={`clickable-${op}-rs-entry`}
                  type="submit"
                  disabled={pristine || submitting}
                  onClick={handleSubmit}
                  buttonStyle="primary paneHeaderNewButton"
                  marginBottom0
                >
                  <FormattedMessage id={`ui-rs.${op}PatronRequest`} />
                </Button>
              </PaneMenu>
            }
            paneTitle={<FormattedMessage id={`ui-rs.${op}PatronRequest`} />}
          >
            <form onSubmit={handleSubmit} id="form-rs-entry">
              <PatronRequestForm locations={locations} requesters={requesters} onSISelect={form.mutators.handleSISelect} />
            </form>
            <FormattedMessage id="ui-rs.confirmDirtyNavigate">
              {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt[0]} />}
            </FormattedMessage>
          </Pane>
        )}
      </Form>
    </Paneset>
  );
};

export default CreateEditRoute;
