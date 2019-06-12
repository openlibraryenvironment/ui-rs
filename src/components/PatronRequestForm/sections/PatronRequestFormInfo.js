import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'redux-form';

import {
  Accordion,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { required } from '@folio/stripes-util';

class PatronRequestFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
    }),
  };

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.patronRequest" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <Col xs={6}>
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
            <Col xs={6}>
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

export default PatronRequestFormInfo;
