import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { Button, TextField } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import css from './NoteForm.css';

class AddNoteForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { noteFieldOpen: false };
  }
  
  handleOnBlur = () => {
    const val = this.noteField?.value
  	if (!val?.trim()) {
  	  // Hide the form.
  	  this.setState({ noteFieldOpen: false });
  	}
  } 

  render() {
    const { noteFieldOpen } = this.state;
    const { onSubmit, className } = this.props;
    const onBlur = this.handleOnBlur;
    
    if (noteFieldOpen) {
      // Render the form
      return (
        <Form
          onClick={ (e) => { e.preventPropegation(); } }
          onSubmit={onSubmit}
          className={ css.container }
          render={({ handleSubmit }) => (
            <form
              id="form-add-note-modal-button"
              onSubmit={handleSubmit}
              autoComplete="off"
              className={classNames( css.form, className ) }
            >
              <Field name="note" component={TextField} onBlur={onBlur} className={css.field} />
              <Button
                buttonClass={css.button}
                onClick={( event ) => {
                  event.stopPropagation();
                  handleSubmit();
                }}
              >
                <FormattedMessage id="ui-rs.actions.send" />
              </Button>
            </form>
          )}
        />
      );
    } else {
      return (<Button buttonClass={css.button}
        onClick={( event ) => {
          event.stopPropagation();
          this.setState({ noteFieldOpen: true });
        }}
      >
        <FormattedMessage id="ui-rs.actions.addNote" />
      </Button>);
    }
  }
}

export default stripesForm({
  form: 'form-add-note-modal-button',
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(AddNoteForm);
