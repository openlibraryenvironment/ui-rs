import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import { Button, Icon } from '@folio/stripes/components';
// eslint-disable-next-line import/no-extraneous-dependencies
import interCss from '@folio/stripes-components/lib/sharedStyles/interactionStyles.css';

import css from './ActionButton.css';
import NoteForm from '../NoteForm';
import { includesNote } from './actionsByState';

const DEFAULT_ICON = 'chevron-double-right';

const ActionButton = ({ action, disabled, performAction, payload = {}, success = null, error = null, icon = null, label, withoutNote = false }) => {
  const [noteFieldOpen, setNoteFieldOpen] = useState(false);
  const onSubmitNote = (note) => {
    performAction(action, { ...payload, note }, { success, error });
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Stop this event from firing if the notes form is shown.
    if (!noteFieldOpen) {
      performAction(action, payload, { success, error });
    }
    // else NOOP.
  };

  const withNote = !withoutNote && ((action ? includesNote[action] : null) ?? includesNote.default);

  if (!noteFieldOpen) {
    return (
      <span className={`${css.actionWrapper} ${interCss.interactionStyles}`}>
        <Button
          buttonStyle="dropdownItem"
          onClick={handleClick}
          buttonClass={classNames({ [`${css.actionButton}`] : true, [`${css.withInlineForm}`]: withNote })}
          disabled={disabled}
        >
          <Icon icon={icon || DEFAULT_ICON} className={css.button}>
            <FormattedMessage id={label} />
          </Icon>
        </Button>
        { withNote && <NoteForm onSend={onSubmitNote} visibility={noteFieldOpen} setVisibility={setNoteFieldOpen} disabled={disabled} className={css.addNoteForm} /> }
      </span>
    );
  } else {
    // Form is open replace the button with a span.
    return (
      <span className={`${css.actionWrapper} ${interCss.interactionStyles}`}>
        <span className={css.inlineFormWrapper}>
          <Icon icon={icon || DEFAULT_ICON} className={css.button}>
            <FormattedMessage id={label} />
          </Icon>
        </span>
        <NoteForm onSend={onSubmitNote} visibility={noteFieldOpen} setVisibility={setNoteFieldOpen} className={css.addNoteForm} />
      </span>
    );
  }
};

ActionButton.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.string,
  action: PropTypes.string.isRequired,
  payload: PropTypes.object,
  success: PropTypes.string,
  error: PropTypes.string,
  performAction: PropTypes.func.isRequired,
  withoutNote: PropTypes.bool,
};

export default ActionButton;
