import { FormattedMessage } from 'react-intl';
import { Field, Form } from 'react-final-form';
import { useQueryClient } from 'react-query';
import { Prompt } from 'react-router-dom';
import { Button, Pane, Paneset, PaneMenu, TextArea } from '@folio/stripes/components';
import { useCloseDirect, usePerformAction, useOkapiQuery } from '@projectreshare/stripes-reshare';

const LocalNoteRoute = props => {
  const { match } = props;
  const id = match.params?.id;
  const performAction = usePerformAction(id);
  const queryClient = useQueryClient();
  const close = useCloseDirect();
  const reqQuery = useOkapiQuery(`rs/patronrequests/${id}`, { enabled: !!id });

  if (!reqQuery.isSuccess) return null;
  const request = reqQuery.data;

  const onSuccessfulEdit = async () => {
    await queryClient.invalidateQueries(`rs/patronrequests/${id}`);
    close();
  };

  const submit = async submitted => {
    const res = await performAction('localNote', submitted,
      { error: 'stripes-reshare.actions.localNote.error', success: 'stripes-reshare.actions.localNote.success' });
    await onSuccessfulEdit();
    return res;
  };

  return (
    <Paneset>
      <Form onSubmit={submit} initialValues={{ localNote: request.localNote }} keepDirtyOnReinitialize>
        {({ handleSubmit, pristine, submitting, submitSucceeded }) => (
          <Pane
            defaultWidth="100%"
            centerContent
            onClose={close}
            dismissible
            lastMenu={
              <PaneMenu>
                <Button
                  type="submit"
                  disabled={pristine || submitting}
                  onClick={handleSubmit}
                  buttonStyle="primary paneHeaderNewButton"
                  marginBottom0
                >
                  <FormattedMessage id="ui-rs.save" />
                </Button>
              </PaneMenu>
            }
            paneTitle={<FormattedMessage id="stripes-reshare.actions.localNote" />}
          >
            <form onSubmit={handleSubmit} id="form-rs-entry">
              <Field
                name="localNote"
                label={<FormattedMessage id="ui-rs.information.localNote" />}
                component={TextArea}
                rows={25}
                autoFocus
              />
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

export default LocalNoteRoute;

