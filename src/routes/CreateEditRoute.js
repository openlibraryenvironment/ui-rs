import React, { useContext } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form } from 'react-final-form';
import { Prompt, useLocation } from 'react-router-dom';
import { Button, Pane, Paneset, PaneMenu, KeyValue } from '@folio/stripes/components';
import { stripesConnect, CalloutContext } from '@folio/stripes/core';
import PatronRequestForm from '../components/PatronRequestForm';

const handleSISelect = (args, state, tools) => {
  Object.entries(args[0]).forEach(([field, value]) => tools.changeValue(state, field, () => value));
};

const renderLastMenu = (pristine, submitting, submit, isEditing) => {
  let id;
  let label;
  if (isEditing) {
    id = 'clickble-update-rs-entry';
    label = <FormattedMessage id="ui-rs.updatePatronRequest" />;
  } else {
    id = 'clickable-create-rs-entry';
    label = <FormattedMessage id="ui-rs.createPatronRequest" />;
  }

  return (
    <PaneMenu>
      <Button
        id={id}
        type="submit"
        disabled={pristine || submitting}
        onClick={submit}
        buttonStyle="primary paneHeaderNewButton"
        marginBottom0
      >
        {label}
      </Button>
    </PaneMenu>
  );
};

const CreateEditRoute = props => {
  const {
    history,
    match,
    mutator,
    resources,
    intl,
  } = props;

  const routerLocation = useLocation();
  const callout = useContext(CalloutContext);

  if (!resources?.locations?.hasLoaded) return null;
  // locations are where rec.type.value is 'branch' and there is a tag in rec.type.tags where the value is 'pickup'
  // and are formatted for the Select component as { value: lmsLocationCode, label: name }
  const locations = resources.locations.records
    .filter(rec => rec?.type?.value === 'branch'
      && rec?.tags.reduce((acc, cur) => acc || cur?.value === 'pickup', false))
    .reduce((acc, cur) => ([...acc, { value: cur.slug, label: cur.name }]), []);

  const validRequesterRecords = resources.locations.records
    .filter(rec => rec?.type?.value === 'institution');
  if (!validRequesterRecords?.[0]?.symbols?.[0]?.symbol) throw new Error('Cannot resolve symbol to create requests as');
  const requesters = validRequesterRecords.reduce((acc, cur) => ([...acc, { value: `${cur.symbols[0].authority.symbol}:${cur.symbols[0].symbol}`, label: cur.name }]), []);

  const isEditing = typeof match.params.id === 'string';
  let initialValues = {};
  if (isEditing) {
    if (!resources?.selectedRecord?.hasLoaded) return null;
    const record = resources.selectedRecord.records[0];
    initialValues = { ...record,
      formattedDateCreated: (
        intl.formatDate(record.dateCreated) + ', ' + intl.formatTime(record.dateCreated)
      ) };
  }

  const submit = newRecord => {
    if (isEditing) {
      return mutator.selectedRecord.PUT(newRecord)
        .then(() => history.goBack())
        .catch(res => callout.sendCallout({ type: 'error',
          message: (
            <KeyValue
              label={<FormattedMessage id="ui-rs.update.error" />}
              value={res?.statusText || ''}
            />
          ) }));
    }
    const baseRecord = {
      requestingInstitutionSymbol: requesters[0].value,
      isRequester: true
    };
    return (
      mutator.patronRequests
        .POST({ ...baseRecord, ...newRecord })
        // When creating a new request we need to delay before redirecting to the request's page to
        // give the server some time to resolve the requesting institution from the symbol and generate
        // an appropriate ID.
        .then(res => new Promise(resolve => setTimeout(() => resolve(res), 3000)))
        // We want to go to the new record but we also want it to be easy to return to where we were,
        // hence use of history.replace rather than history.push -- the create form turns into the
        // created record.
        .then(res => history.replace(`view/${res.id}${routerLocation.search}`))
        .catch(res => callout.sendCallout({ type: 'error',
          message: (
            <KeyValue
              label={<FormattedMessage id="ui-rs.create.error" />}
              value={res?.statusText || ''}
            />
          ) }))
    );
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
            lastMenu={renderLastMenu(pristine, submitting, handleSubmit, isEditing)}
            paneTitle={<FormattedMessage id={isEditing ? 'ui-rs.updatePatronRequest' : 'ui-rs.createPatronRequest'} />}
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

CreateEditRoute.manifest = {
  patronRequests: {
    type: 'okapi',
    path: 'rs/patronrequests',
    fetch: false,
    throwErrors: false,
  },
  selectedRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}',
    throwErrors: false,
  },
  locations: {
    type: 'okapi',
    path: 'directory/entry?filters=(type.value%3D%3Dinstitution)%7C%7C(tags.value%3Di%3Dpickup)&filters=status.value%3D%3Dmanaged&perPage=100',
  },
  query: {},
};

export default stripesConnect(injectIntl(CreateEditRoute));
