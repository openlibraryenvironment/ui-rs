import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'react-final-form';

import {
  Accordion,
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
    const custProps = this.props.parentResources.selectedRecord.records[0].customProperties
    let id
    if (custProps.local_patronAccountBarcode) {
      id = custProps.local_patronAccountBarcode[0].id
    }
    const handleChange = (e, input) => {
      if (id) {
        input.onChange({
          "local_patronAccountBarcode": [{id: id, value: e.target.value }], 
        });
      } else {
        input.onChange({
          "local_patronAccountBarcode": [{value: e.target.value }],
        });
      }
    };

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.local.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <FormattedMessage id="ui-directory.information.local.patronAccountBarcode">
              {placeholder => (
                <Field
                  name="customProperties"
                  render={({ input }) => {
                    return (
                      <TextField
                      id="edit-directory-entry-patron-account-barcode"
                        onChange={(e) => handleChange(e, input)}
                        label={placeholder}
                        placeholder={placeholder}
                      />
                    );
                  }}
                />
              )}
            </FormattedMessage>
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
