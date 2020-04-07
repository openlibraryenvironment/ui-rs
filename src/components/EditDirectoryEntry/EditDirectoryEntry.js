import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { Prompt } from 'react-router-dom';

import {
  Button,
  IconButton,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import DirectoryEntryForm from '../DirectoryEntryForm';

const defaultSubmit = (directory, dispatch, props) => {
  return props.onUpdate(directory)
    .then(() => props.onCancel());
};

class EditDirectoryEntry extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    parentResources:PropTypes.shape({
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
    }),
    resources: PropTypes.shape({
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
    }),
  }

  static defaultProps = {
    onSubmit: defaultSubmit
  }

  getCurrentLayer() {
    const layer = this.props?.resources ? this.props?.resources?.query?.layer : this.props?.parentResources?.query?.layer;
    return layer;
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
    let id;
    let label;
    const layer = this.getCurrentLayer();

    if (layer === 'edit') {
      id = 'clickable-update-directory-entry';
      label = <FormattedMessage id="ui-directory.updateDirectoryEntryNoName" />;
    } else {
      id = 'clickable-create-directory-entry';
      label = <FormattedMessage id="ui-directory.create" />;
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

    // This allows the initial values to hold the current parent value
    if (initialValues) {
      if (initialValues.parent) {
        initialValues.parent = initialValues.parent.id;
      }
      if (initialValues.type) {
        initialValues.type = initialValues.type.id;
      }
    }
    // the submit handler passed in from SearchAndSort expects props as provided by redux-form
    const compatSubmit = values => {
      // TODO This could possibly be neatened and sorted before submittal

      // Not submitting values itself because then on failure data changes shape
      const submitValues = { ...values };

      if (values.parent) {
        submitValues.parent = { id: values.parent };
      }
      submitValues.symbols = values.symbols?.map(obj => (obj?.authority?.id ? obj : ({ ...obj, authority: { id: obj.authority } })));
      onSubmit(submitValues, null, this.props);
    };

    const layer = this.getCurrentLayer();
    let paneTitle = <FormattedMessage id="ui-directory.notSet" />;
    switch (layer) {
      case 'edit':
        if (initialValues && initialValues.id) {
          paneTitle = <FormattedMessage id="ui-directory.updateDirectoryEntry" values={{ dirent: initialValues.name }} />;
        } else {
          paneTitle = <FormattedMessage id="ui-directory.updateDirectoryEntryNoName" />;
        }
        break;
      case 'unit':
        paneTitle = <FormattedMessage id="ui-directory.createUnitDirectoryEntry" />;
        break;
      case 'create':
        paneTitle = <FormattedMessage id="ui-directory.createDirectoryEntry" />;
        break;
      default:
        break;
    }

    return (
      <Form
        onSubmit={compatSubmit}
        initialValues={initialValues}
        keepDirtyOnReinitialize
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ form, handleSubmit, pristine, submitting, submitSucceeded, values }) => (
          <form id="form-directory-entry">
            <Pane
              defaultWidth="100%"
              firstMenu={this.renderFirstMenu()}
              lastMenu={this.renderLastMenu(pristine, submitting, handleSubmit)}
              paneTitle={paneTitle}
            >
              <DirectoryEntryForm values={values} form={form} {...this.props} />
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
