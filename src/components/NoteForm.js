import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { Button, TextField } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

import css from './NoteForm.css';

class AddNoteForm extends React.Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    setVisibility: PropTypes.func.isRequired,
    visibility: PropTypes.bool.isRequired,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { noteValue: null };
  }

  stopPropagation = event => { event.preventDefault(); event.stopPropagation(); }

  handleSend = (e) => {
    this.stopPropagation(e);
    const val = this.state.noteValue?.trim();
    this.props.onSend(val ?? null);
  }

  handleOnBlur = () => {
    const val = this.state.noteValue?.trim() ?? '';
    if (val === '') {
      this.props.setVisibility(false);
    }
  }

  render() {
    const { className, setVisibility, visibility } = this.props;

    if (visibility) {
      // Render the form
      return (
        <Form
          onSubmit={this.stopPropagation}
          render={({ handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              className={className}
            >
              <Field name="note" component={TextField} onBlur={this.handleOnBlur} autoFocus onChange={(e) => { this.setState({ noteValue : e.target.value }); }} />
              <Button
                onClick={this.handleSend}
                onBlur={this.handleOnBlur}
              >
                <FormattedMessage id="ui-rs.actions.send" />
              </Button>
            </form>
          )}
        />
      );
    } else {
      return (
        <Button
          buttonClass={css.addNoteButton}
          onClick={(event) => {
            this.stopPropagation(event);
            setVisibility(true);
          }}
        >
          <FormattedMessage id="ui-rs.actions.addNote" />
        </Button>
      );
    }
  }
}

export default AddNoteForm;
