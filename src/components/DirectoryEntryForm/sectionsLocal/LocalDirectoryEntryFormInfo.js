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

class LocalDirectoryEntryFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
      selectedRecord: PropTypes.shape({
        records: PropTypes.array
      }),
    }),
  };

  getTypeValues() {
    return get(this.props.parentResources.typeValues, ['records'], [])
      .map(({ id, label }) => ({ label, value: id }));
  }

  handleCustPropChange(property_name, e, input) {
    const custProps = this.props.parentResources.selectedRecord.records[0].customProperties;
    let id;

    if (custProps[property_name]) {
      id = custProps[property_name][0].id;
    }
      if (id) {
        input.onChange({
          [property_name]: [{ id, value: e.target.value }],
        });
      } else {
        input.onChange({
          [property_name]: [{ value: e.target.value }],
        });
      }
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
            <Col xs={6}>
              <FormattedMessage id="ui-directory.information.local.patronAccountBarcode">
                {placeholder => (
                  <Field
                    name="local_Barcode"
                    render={({ input }) => {
                      return (
                        <TextField
                          id="edit-directory-entry-patron-account-barcode"
                          onChange={(e) => this.handleCustPropChange('local_patronAccountBarcode', e, input)}
                          label={placeholder}
                          placeholder={placeholder}
                        />
                      );
                    }}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={6}>
              <FormattedMessage id="ui-directory.information.local.widget1">
                {placeholder => (
                  <Field
                    name="local_widg1"
                    render={({ input }) => {
                      return (
                        <TextField
                          id="edit-directory-entry-widget-1"
                          onChange={(e) => this.handleCustPropChange('local_widget_1', e, input)}
                          label={placeholder}
                          placeholder={placeholder}
                        />
                      );
                    }}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
          <Row>
          <Col xs={6}>
              <FormattedMessage id="ui-directory.information.local.widget2">
                {placeholder => (
                  <Field
                    name="local_widg2"
                    render={({ input }) => {
                      return (
                        <TextField
                          id="edit-directory-entry-widget-2"
                          onChange={(e) => this.handleCustPropChange('local_widget_2', e, input)}
                          label={placeholder}
                          placeholder={placeholder}
                        />
                      );
                    }}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={6}>
              <FormattedMessage id="ui-directory.information.local.widget3">
                {placeholder => (
                  <Field
                    name="local_widg3"
                    render={({ input }) => {
                      return (
                        <TextField
                          id="edit-directory-entry-widget-3"
                          onChange={(e) => this.handleCustPropChange('local_widget_3', e, input)}
                          label={placeholder}
                          placeholder={placeholder}
                        />
                      );
                    }}
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

export default LocalDirectoryEntryFormInfo;
