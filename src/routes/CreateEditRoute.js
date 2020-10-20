import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Form } from 'react-final-form';
import { Prompt } from 'react-router-dom';
import { Button, Pane, Paneset, PaneMenu } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import PatronRequestForm from '../components/PatronRequestForm';

const renderLastMenu = (pristine, submitting, submit, isEditing) => {
  let id;
  let label;
  if (isEditing) {
    id = 'clickable-update-rs-entry';
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
    resources: { selectedRecord: resource },
    intl,
  } = props;

  const isEditing = typeof match.params.id === 'string';
  let initialValues = {};
  if (isEditing) {
    if (!resource || !resource.hasLoaded) return null;
    const record = resource.records[0];
    initialValues = { ...record,
      formattedDateCreated: (
        intl.formatDate(record.dateCreated) + ', ' + intl.formatTime(record.dateCreated)
      ) };
  }

  const submit = newRecord => {
    if (isEditing) {
      return mutator.selectedRecord.PUT(newRecord).then(() => history.goBack());
    }
    return (
      mutator.patronRequests
        .POST(newRecord)
        // We want to go to the new record but we also want it to be easy to return to where we were,
        // hence use of history.replace rather than history.push -- the create form turns into the
        // created record.
        .then(res => history.replace(`view/${res.id}`))
    );
  };

  return (
    <Paneset>
      <Form onSubmit={submit} initialValues={initialValues} keepDirtyOnReinitialize>
        {({ handleSubmit, pristine, submitting, submitSucceeded }) => (
          <Pane
            defaultWidth="100%"
            onClose={history.goBack}
            dismissible
            lastMenu={renderLastMenu(pristine, submitting, handleSubmit, isEditing)}
            paneTitle={<FormattedMessage id={isEditing ? 'ui-rs.updatePatronRequest' : 'ui-rs.createPatronRequest'} />}
          >
            <form onSubmit={handleSubmit} id="form-rs-entry">
              <PatronRequestForm />
            </form>
            <FormattedMessage id="ui-rs.confirmDirtyNavigate">
              {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt} />}
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
  },
  selectedRecord: {
    type: 'okapi',
    path: 'rs/patronrequests/:{id}',
  },
  query: {},
};

CreateEditRoute.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.object,
  }).isRequired,
  history: PropTypes.object.isRequired,
  mutator: PropTypes.shape({
    patronRequests: PropTypes.object,
    selectedRecord: PropTypes.object,
  }).isRequired,
  resources: PropTypes.shape({
    selectedRecord: PropTypes.object,
  }).isRequired,
  intl: PropTypes.object.isRequired,
};
export default stripesConnect(injectIntl(CreateEditRoute));
