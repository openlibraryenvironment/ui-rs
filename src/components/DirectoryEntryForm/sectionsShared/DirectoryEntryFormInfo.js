import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'react-final-form';

import {
  Accordion,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { required } from '../../../util/validators';

class DirectoryEntryFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
    }),
  };

  getTypeValues() {
    return get(this.props.parentResources.typeValues, ['records'], [])
      .map(({ id, label }) => ({ label, value: id }));
  }

  render() {
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <Col xs={5}>
              <FormattedMessage id="ui-directory.information.name">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-name"
                    name="name"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    required
                    validate={required}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={2}>
             (Status)
            </Col>
            <Col xs={5}>
              <FormattedMessage id="ui-directory.information.slug">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-slug"
                    name="slug"
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

export default DirectoryEntryFormInfo;
