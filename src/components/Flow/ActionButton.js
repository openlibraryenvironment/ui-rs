import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Icon, Row } from '@folio/stripes/components';

import AddNoteForm from '../AddNoteForm';

const onSubmitNote = (values, props) => {
  const { action, success, error, performAction } = props;
  const payload = { note: values.note };

  performAction(action, payload, success, error);
  return null;
};

const ActionButton = ({ label, icon, action, payload, success, error, performAction, withoutNote }) => (
  <Row>
    <Col xs={withoutNote ? 12 : 8}>
      <Button
        buttonStyle="dropdownItem"
        onClick={() => performAction(action, payload, success, error)}
      >
        <Icon icon={icon || 'default'}>
          <FormattedMessage id={label} />
        </Icon>
      </Button>
    </Col>
    { !withoutNote &&
      <Col xs={4}>
        <AddNoteForm onSubmit={onSubmitNote} />
      </Col>
    }
  </Row>
);

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
