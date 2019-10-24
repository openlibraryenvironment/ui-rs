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
                    name="local_patronAccountBarcode"
                    component={TextField}
                    id="edit-directory-entry-patron-account-barcode"
                    label={placeholder}
                    placeholder={placeholder}
                    />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={6}>
              <FormattedMessage id="ui-directory.information.local.widget1">
                {placeholder => (
                  <Field
                    name="local_widget_1"
                    component={TextField}
                    id="edit-directory-entry-widget-1"
                    label={placeholder}
                    placeholder={placeholder}
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
                    name="local_widget_2"
                    component={TextField}
                    id="edit-directory-entry-widget-2"
                    label={placeholder}
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={6}>
              <FormattedMessage id="ui-directory.information.local.widget3">
                {placeholder => (
                  <Field
                    name="local_widget_3"
                    component={TextField}
                    id="edit-directory-entry-widget-3"
                    label={placeholder}
                    placeholder={placeholder}
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
