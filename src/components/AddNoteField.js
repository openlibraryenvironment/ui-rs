import React, { useState } from 'react';
import { Field } from 'react-final-form';
import { Button, Col, Row, TextField } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

const AddNoteForm = () => {
  const [noteFieldOpen, setnoteFieldOpen] = useState(false);

  const renderMessageField = () => {
    if (noteFieldOpen === true) {
      return (
        <Field name="note" component={TextField} />
      );
    }
    return null;
  };

  return (
    <Row>
      <Col xs={4}>
        <Button onClick={() => {
          setnoteFieldOpen(!noteFieldOpen);
        }}
        >
          {noteFieldOpen ? <FormattedMessage id="ui-rs.actions.hideNoteField" /> : <FormattedMessage id="ui-rs.actions.addNote" />}
        </Button>
      </Col>
      <Col xs={8}>
        {renderMessageField()}
      </Col>
    </Row>
  );
}

export default AddNoteForm;
