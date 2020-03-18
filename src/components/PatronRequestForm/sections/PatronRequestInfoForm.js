import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Accordion,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { required } from '@folio/stripes/util';

class PatronRequestInfoForm extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.requestedItem" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <Col xs={12}>
              <FormattedMessage id="ui-rs.information.title">
                {placeholder => (
                  <Field
                    id="edit-patron-request-title"
                    name="title"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    required
                    validate={required}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
          <Row>
            <Col xs={3}>
              <FormattedMessage id="ui-rs.information.date">
                {placeholder => (
                  <Field
                    id="edit-patron-request-publicationDate"
                    name="publicationDate"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    required
                    validate={required}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={9}>
              <FormattedMessage id="ui-rs.information.author">
                {placeholder => (
                  <Field
                    id="edit-patron-request-author"
                    name="author"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    required
                    validate={required}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
        </React.Fragment>
      </Accordion>
    );
  }
}

export default PatronRequestInfoForm;
