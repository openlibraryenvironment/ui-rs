import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import { Prompt } from 'react-router-dom';

import {
  Button,
  IconButton,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import PatronRequestForm from '../PatronRequestForm';

const defaultSubmit = (agreement, dispatch, props) => {
  return props.onUpdate(agreement)
    .then(() => props.onCancel());
};

class EditPatronRequest extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    onSubmit: defaultSubmit
  }

  renderFirstMenu() {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-rs.closeNewPatronRequest">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-rs-form-button"
              onClick={this.props.onCancel}
              aria-label={ariaLabel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }

  renderLastMenu(pristine, submitting, submit) {
    const { initialValues } = this.props;

    let id;
    let label;
    if (initialValues && initialValues.id) {
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
  }

  render() {
    const { initialValues, onSubmit } = this.props;
    // the submit handler passed in from SearchAndSort expects props as provided by redux-form
    const compatSubmit = values => onSubmit(values, null, this.props);
    const paneTitle = initialValues && initialValues.id ?
      initialValues.title : <FormattedMessage id="ui-rs.createPatronRequest" />;

    return (
      <Form
        onSubmit={compatSubmit}
        initialValues={initialValues}
        keepDirtyOnReinitialize
      >
        {({ handleSubmit, pristine, submitting, submitSucceeded }) => (
          <form onSubmit={handleSubmit} id="form-rs-entry">
            <Pane
              defaultWidth="100%"
              firstMenu={this.renderFirstMenu()}
              lastMenu={this.renderLastMenu(pristine, submitting, handleSubmit)}
              paneTitle={paneTitle}
            >
              <PatronRequestForm {...this.props} />
            </Pane>
            <FormattedMessage id="ui-rs.confirmDirtyNavigate">
              {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt} />}
            </FormattedMessage>
          </form>
        )}
      </Form>
    );
  }
}

export default EditPatronRequest;
