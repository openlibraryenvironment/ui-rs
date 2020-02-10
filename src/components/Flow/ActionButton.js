import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Icon, Row } from '@folio/stripes/components';

import AddNoteForm from '../AddNoteForm';

const ActionButton = props => {
  const onSubmitNote = (values) => {
    const { action, success, error, performAction } = props;
    const payload = { note: values.note };
    performAction(action, payload, success, error);
    return null;
  };

  return (
    <Row>
      <Col xs={props.withoutNote ? 12 : 8}>
        <Button
          buttonStyle="dropdownItem"
          onClick={() => props.performAction(props.action, props.payload, props.success, props.error)}
        >
          <Icon icon={props.icon || 'default'}>
            <FormattedMessage id={props.label} />
          </Icon>
        </Button>
      </Col>
      { !props.withoutNote &&
        <Col xs={4}>
          <AddNoteForm onSubmit={onSubmitNote} submitNoteProps={props} />
        </Col>
      }
    </Row>
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
  withoutNote: PropTypes.bool,
};


export default ActionButton;
