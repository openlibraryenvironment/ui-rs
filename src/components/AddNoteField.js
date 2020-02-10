import React from 'react';
import { Field } from 'react-final-form';
import { Button, Col, Row, TextField } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

class AddNoteForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { noteFieldOpen: false };
  }

  renderMessageField() {
    const { noteFieldOpen } = this.state;
    if (noteFieldOpen === true) {
      return (
        <Field name="note" component={TextField} />
      );
    }
    return null;
  }

  render() {
    const { noteFieldOpen } = this.state;
    return (
      <Row>
        <Col xs={4}>
          <Button onClick={() => {
            this.setState({ noteFieldOpen: !noteFieldOpen });
          }}
          >
            {noteFieldOpen ? <FormattedMessage id="ui-rs.actions.hideNoteField" /> : <FormattedMessage id="ui-rs.actions.addNote" />}
          </Button>
        </Col>
        <Col xs={8}>
          {this.renderMessageField()}
        </Col>
      </Row>
    );
  }
}

export default AddNoteForm;
