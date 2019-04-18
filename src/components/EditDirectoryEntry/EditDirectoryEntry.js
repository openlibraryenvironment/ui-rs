import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import stripesForm from '@folio/stripes/form';

import {
  Button,
  IconButton,
  Pane,
  PaneMenu,
} from '@folio/stripes/components';

import DirectoryEntryForm from '../DirectoryEntryForm';

const handleSubmit = (agreement, dispatch, props) => {
  props.onUpdate(agreement)
    .then(() => props.onCancel());
};

class EditDirectoryEntry extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    // onSave: PropTypes.func,
    onCancel: PropTypes.func,
    // onRemove: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
    // parentResources: PropTypes.object,
    // parentMutator: PropTypes.object,
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

  renderLastMenu() {
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
          disabled={this.props.pristine || this.props.submitting}
          onClick={this.props.handleSubmit}
          buttonStyle="primary paneHeaderNewButton"
          marginBottom0
        >
          {label}
        </Button>
      </PaneMenu>
    );
  }

  render() {
    const { initialValues } = this.props;
    const paneTitle = initialValues && initialValues.id ?
      initialValues.name : <FormattedMessage id="ui-directory.createDirectoryEntry" />;

    return (
      <form id="form-directory-entry">
        <Pane
          defaultWidth="100%"
          firstMenu={this.renderFirstMenu()}
          lastMenu={this.renderLastMenu()}
          paneTitle={paneTitle}
        >
          <DirectoryEntryForm {...this.props} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'directoryForm',
  onSubmit: handleSubmit,
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(EditDirectoryEntry);
