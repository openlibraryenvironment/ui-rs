import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import { Prompt } from 'react-router-dom';

import {
  Button,
  Card,
  IconButton,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import DirectoryEntryForm from '../DirectoryEntryForm';

const defaultSubmit = (agreement, dispatch, props) => {
  return props.onUpdate(agreement)
    .then(() => props.onCancel());
};

class EditDirectoryEntry extends React.Component {
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
        <FormattedMessage id="ui-directory.closeNewDirectoryEntry">
          {ariaLabel => (
            <IconButton
              icon="times"
              id="close-directory-form-button"
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
      id = 'clickable-update-directory-entry';
      label = <FormattedMessage id="ui-directory.updateDirectoryEntry" />;
    } else {
      id = 'clickable-create-directory-entry';
      label = <FormattedMessage id="ui-directory.createDirectoryEntry" />;
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
    const compatSubmit = values => {




      // Logic to change several local fields into sub-fields in the single customProperties field
      if (!values.customProperties) {
        values.customProperties = {}
      }
      Object.keys(values).forEach(function (prop) {
        if(prop.substring(0,5) === "local") {
          let id;
          if (values.customProperties[prop]) {
            id = values.customProperties[prop][0].id;
          }
          console.log("Id: ", id)
          if (id) {
            values.customProperties[prop] = [{ id: id, value: values[prop] }]
          } else {
            values.customProperties[prop] = [{ value: values[prop] }]
          }
          delete values[prop]
        }
      });

      onSubmit(values, null, this.props);
    };
    const paneTitle = initialValues && initialValues.id ?
      initialValues.name : <FormattedMessage id="ui-directory.createDirectoryEntry" />;
    return (
      <Form
        onSubmit={compatSubmit}
        initialValues={initialValues}
        keepDirtyOnReinitialize
      >
        {({ handleSubmit, pristine, submitting, submitSucceeded, values }) => (
          <form id="form-directory-entry">
            <Pane
              defaultWidth="100%"
              firstMenu={this.renderFirstMenu()}
              lastMenu={this.renderLastMenu(pristine, submitting, handleSubmit)}
              paneTitle={paneTitle}
            >
              <DirectoryEntryForm {...this.props} />
              <FormattedMessage id="ui-directory.confirmDirtyNavigate">
                {prompt => <Prompt when={!pristine && !(submitting || submitSucceeded)} message={prompt} />}
              </FormattedMessage>
            </Pane>
          </form>
        )}
      </Form>
    );
  }
}

export default EditDirectoryEntry;
