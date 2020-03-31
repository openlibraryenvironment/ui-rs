import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Icon } from '@folio/stripes/components';

import NoteForm from '../NoteForm';
import { includesNote } from './actionsByState';

import css from './ActionButton.css';

const ActionButton = props => {
  const onSubmitNote = (values) => {
    const { action, success, error, performAction } = props;
    const payload = { note: values.note };
    performAction(action, payload, success, error);
    return null;
  };

  const withNote = true; //includesNote[props?.action] ?? includesNote.default;
  return (
    <div className={css.container}>
      <Button
        buttonStyle="dropdownItem"
        onClick={() => props.performAction(props.action, props.payload, props.success, props.error)}
      	buttonClass={{ [`${css.actionButton}`] : true, [`${css.withInlineForm}`]: withNote }}
      >
        <Icon icon={props.icon || 'default'} className={css.button}>
          <FormattedMessage id={props.label} />
        </Icon>
        { withNote && <NoteForm onSubmit={onSubmitNote} submitNoteProps={props} className={css.addNoteForm} /> }
      </Button>
    </div>
  );
};

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  action: PropTypes.string.isRequired,
  payload: PropTypes.object,
  success: PropTypes.string,
  error: PropTypes.string,
  performAction: PropTypes.func.isRequired,
};


export default ActionButton;
