import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Col, Icon, Row } from '@folio/stripes/components';

import AddNoteForm from '../AddNoteForm';

class ActionButton extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.string,
    action: PropTypes.string.isRequired,
    payload: PropTypes.object,
    success: PropTypes.string,
    error: PropTypes.string,
    performAction: PropTypes.func.isRequired,
    withoutNote: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.onSubmitNote = this.onSubmitNote.bind(this);
  }

  onSubmitNote(values) {
    const { action, success, error, performAction } = this.props;
    const payload = { note: values.note }

    performAction(action, payload, success, error);
    return null;
  }

  render() {
    const { label, icon, action, payload, success, error, performAction, withoutNote } = this.props;
    return (
      <Row>
        <Col xs={8}>
          <Button
            buttonStyle="dropdownItem"
            onClick={() => performAction(action, payload, success, error)}
          >
            <Icon icon={icon || 'default'}><FormattedMessage id={label} /></Icon>
          </Button>
        </Col>
        <Col xs={4}>
          { !withoutNote &&
            <AddNoteForm onSubmit={this.onSubmitNote} />
          }
        </Col>
      </Row>
    );
  }
}

export default ActionButton;
