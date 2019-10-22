import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Accordion,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { required } from '../../../util/validators';

class LocalDirectoryEntryFormInfo extends React.Component {
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
        label={<FormattedMessage id="ui-directory.information.local.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <FieldArray name="customProperties">
              {({ fields }) => 
                fields.map((name) => (
                  <div key = {name}>
                    <FormattedMessage id="ui-directory.information.local.patronAccountBarcode">
                    <Field
                      id="edit-directory-entry-patron-account-barcode"
                      name={'${name}.local_patronAccountBarcode'}
                      component={TextField}
                    />
                    </FormattedMessage>
                  </div>
                ))
              }
            </FieldArray>
          </Row>
          <Row>
            <FormattedMessage id="ui-directory.information.description">
              {placeholder => (
                <Field
                  id="edit-directory-entry-description"
                  name="description"
                  label={placeholder}
                  component={TextField}
                  placeholder={placeholder}
                />
              )}
            </FormattedMessage>
          </Row>
        </React.Fragment>
      </Accordion>
    );
  }
}

export default LocalDirectoryEntryFormInfo;
