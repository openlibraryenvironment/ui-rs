import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { Button, TextField } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import css from './AddNoteForm.css';

class AddNoteForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { noteFieldOpen: false };
  }

  render() {
    const { noteFieldOpen } = this.state;
    const { onSubmit, className } = this.props;
    return (
      <Form
        onSubmit={onSubmit}
        className={ css.container }
        render={({ handleSubmit }) => (
          <form
            id="form-add-note-modal-button"
            onSubmit={handleSubmit}
            autoComplete="off"
            className={classNames( css.form, className ) }
          >
            {noteFieldOpen ? <Field name="note" component={TextField} className={css.field} /> : <div className={css.field} />}
            <Button
              buttonClass={css.button}
              onClick={() => {
                if (noteFieldOpen) {
                  handleSubmit();
                }
                this.setState({ noteFieldOpen: !noteFieldOpen });
              }}
            >
              {noteFieldOpen ? <FormattedMessage id="ui-rs.actions.send" /> : <FormattedMessage id="ui-rs.actions.addNote" />}
            </Button>
          </form>
        )}
      />
    );
  }
}

export default stripesForm({
  form: 'form-add-note-modal-button',
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(AddNoteForm);
