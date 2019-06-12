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

import PatronRequestForm from '../PatronRequestForm';

const handleSubmit = (agreement, dispatch, props) => {
  props.onUpdate(agreement)
    .then(() => props.onCancel());
};

class EditPatronRequest extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func,
    onUpdate: PropTypes.func.isRequired,
    pristine: PropTypes.bool,
    submitting: PropTypes.bool,
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

  renderLastMenu() {
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
      initialValues.title : <FormattedMessage id="ui-rs.createPatronRequest" />;

    return (
      <form id="form-rs-entry">
        <Pane
          defaultWidth="100%"
          firstMenu={this.renderFirstMenu()}
          lastMenu={this.renderLastMenu()}
          paneTitle={paneTitle}
        >
          <PatronRequestForm {...this.props} />
        </Pane>
      </form>
    );
  }
}

export default stripesForm({
  form: 'rsForm',
  onSubmit: handleSubmit,
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(EditPatronRequest);
