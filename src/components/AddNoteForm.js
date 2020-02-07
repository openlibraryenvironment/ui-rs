import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';
import { Button, Col, Row, TextField } from '@folio/stripes/components';
import stripesForm from '@folio/stripes/form';
import { FormattedMessage } from 'react-intl';

class AddNoteForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { noteFieldOpen: false };
  }

  renderMessageField() {
    const { noteFieldOpen } = this.state;
    if (noteFieldOpen === true) {
      return (
        <Field
          name="note"
          component={TextField}
        />
      );
    }
    return null;
  }

  render() {
    const { noteFieldOpen } = this.state;
    const { onSubmit } = this.props;
    return (
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form
            id="form-add-note-modal-button"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <Row>
              <Col xs={8}>
                {this.renderMessageField()}
              </Col>
              <Col xs={4}>
                <Button onClick={() => {
                  this.setState({ noteFieldOpen: !noteFieldOpen });
                  if (noteFieldOpen) {
                    handleSubmit();
                  }
                }}
                >
                  {noteFieldOpen ? <FormattedMessage id="ui-rs.actions.send" /> : <FormattedMessage id="ui-rs.actions.addNote" />}
                </Button>
              </Col>
            </Row>
          </form>
        )}
      />
    );
  }
}

export default stripesForm({
  form: 'form-add-note-modal-button',
  navigationCheck: true,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
})(AddNoteForm);
