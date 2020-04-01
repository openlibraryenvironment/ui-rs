import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { Button, TextField } from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';

import css from './NoteForm.css';

class AddNoteForm extends React.Component {
  static propTypes = {
    onSend: PropTypes.func.isRequired,
    setVisibility: PropTypes.func.isRequired,
    visibility: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);
    this.state = { noteValue: null }
  }
  
  stopPropagation = event => { event.preventDefault();event.stopPropagation(); }
  
  handleSend = ( e ) => {
    this.stopPropagation ( e );
    const val = this.state.noteValue?.trim();
    this.props.onSend( val ?? null );
  }
  
  handleOnBlur = () => {
    const val = this.state.noteValue?.trim() ?? '';
    if (val == '') {
      this.props.setVisibility( false );
    }
  }

  render() {
    const { className, setVisibility, visibility } = this.props;
    
    if (visibility) {
      // Render the form
      return (
        <Form
          onSubmit={ this.stopPropagation }
          render={({ handleSubmit }) => (
            <form
              onSubmit={ handleSubmit }
              onClick={ this.stopPropagation }
              autoComplete="off"
              className={classNames( css.noteForm, className ) }
            >
              <Field name="note" component={TextField} onBlur={this.handleOnBlur} autoFocus className={css.field} onChange={ (e)=>{this.setState({noteValue : e.target.value}); }} />
              <Button
                buttonClass={css.button}
                onClick={ this.handleSend }
                onBlur={ this.handleOnBlur }
              >
                <FormattedMessage id="ui-rs.actions.send" />
              </Button>
            </form>
          )} />
      );
    } else {
      return (<Button buttonClass={css.addNoteButton}
        onClick={( event ) => {
          this.stopPropagation( event );
          setVisibility( true );
        }}
        ><FormattedMessage id="ui-rs.actions.addNote" />
      </Button>);
    }
  }
}

export default AddNoteForm;
