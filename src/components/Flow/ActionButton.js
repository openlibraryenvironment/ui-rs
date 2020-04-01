import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from '@folio/stripes/components';

import NoteForm from '../NoteForm';
import { includesNote } from './actionsByState';

import css from './ActionButton.css';

import interCss from "@folio/stripes-components/lib/sharedStyles/interactionStyles.css";

class ActionButton extends Component {
  
  static propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    action: PropTypes.string.isRequired,
    payload: PropTypes.object,
    success: PropTypes.string,
    error: PropTypes.string,
    performAction: PropTypes.func.isRequired,
  };
  
  constructor( props ) {
    super( props )
    this.state = { noteFieldOpen: false };
  }
  
  onSubmitNote = (note) => {
    const { action, success, error, performAction } = this.props;
    const payload = this.props.payload || {}
    payload.note = note;
    //performAction(action, payload, success, error);
    console.log ("Sending Payload with note %o", payload);
  };
  
  setNoteFormVisibility = visibility => {
    this.setState ({ noteFieldOpen: visibility });
  }
  
  handleClick = ( e ) => {
    e.preventDefault();
    e.stopPropagation();
    const { action, success, error, performAction } = this.props
    const payload = this.props.payload || {}
    
    // Stop this event from firing if the notes form is shown.
    if (!this.state.noteFieldOpen) {
//      performAction(action, payload, success, error);
      console.log ("Sending Payload without note %o", payload);
    }
    // else NOOP.
    else { console.log ('Nothing...') }
  }
  
  render () {
    const { icon, label } = this.props;
    const withNote = true; //includesNote[props?.action] ?? includesNote.default;
    const { noteFieldOpen } = this.state;
    
    if (!noteFieldOpen) {
      return (<span className={ `${css.actionWrapper} ${interCss.interactionStyles}` } >
        <Button
          buttonStyle="dropdownItem"
          onClick={ this.handleClick }
          buttonClass={{ [`${css.actionButton}`] : true, [`${css.withInlineForm}`]: withNote }}
        >
          <Icon icon={icon || 'default'} className={css.button}>
            <FormattedMessage id={label} />
          </Icon>
        </Button>
        { withNote && <NoteForm onSend={this.onSubmitNote} visibility={noteFieldOpen} setVisibility={this.setNoteFormVisibility} className={css.addNoteForm} /> }
      </span>)
      
    } else {
      
      // Form is open replace the button with a span.
      return (<span className={ `${css.actionWrapper} ${interCss.interactionStyles}` } >
        <span className={ css.inlineFormWrapper }>
          <Icon icon={icon || 'default'} className={css.button}>
            <FormattedMessage id={label} />
          </Icon>
        </span>
        <NoteForm onSend={this.onSubmitNote} visibility={noteFieldOpen} setVisibility={this.setNoteFormVisibility} className={css.addNoteForm} />
      </span>)
    }
  }
};

export default ActionButton;
