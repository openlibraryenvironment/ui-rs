import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Icon, Row } from '@folio/stripes/components';

import AddNoteForm from '../AddNoteForm';
import { includesNote } from './actionsByState';

import css from './ActionButton.css';

const ActionButton = props => {
  const onSubmitNote = (values) => {
    const { action, success, error, performAction } = props;
    const payload = { note: values.note };
    performAction(action, payload, success, error);
    return null;
  };

  const withNote = includesNote[props?.action] ?? includesNote.default;
  return (
    <span className={css.container}>
      <div className={css.button}>
        <Button
          buttonStyle="dropdownItem"
          onClick={() => props.performAction(props.action, props.payload, props.success, props.error)}
        >
          <Icon icon={props.icon || 'default'}>
            <FormattedMessage id={props.label} />
          </Icon>
        </Button>
      </div>
      <div className={css.addNoteForm}>
        { withNote &&
          <AddNoteForm onSubmit={onSubmitNote} submitNoteProps={props}  />
        }
      </div>
    </span>
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
