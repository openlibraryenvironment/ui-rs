import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Accordion,
  Col,
  Label,
  Row,
  TextField,
} from '@folio/stripes/components';

import { AddressListFieldArray } from '../components';

class DirectoryEntryFormContactInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
      records: PropTypes.object,
    }),
  };

  getCurrentLayer() {
    const layer = this.props?.parentResources?.query?.layer;
    return layer;
  }

  render() {
    return (
      <>
        <Accordion
          id={this.props.id}
          label={<FormattedMessage id="ui-directory.information.heading.contactInformation" />}
          open={this.props.open}
          onToggle={this.props.onToggle}
        >
          <>
            <Row>
              <Col xs={4}>
                <Field
                  id="edit-directory-entry-phone-number"
                  name="phoneNumber"
                  component={TextField}
                  label={<FormattedMessage id="ui-directory.information.mainPhoneNumber" />}
                  parse={v => v}
                />
              </Col>
              <Col xs={4}>
                <Field
                  id="edit-directory-entry-email-address"
                  name="emailAddress"
                  component={TextField}
                  label={<FormattedMessage id="ui-directory.information.mainEmailAddress" />}
                  parse={v => v}
                />
              </Col>
              <Col xs={4}>
                <Field
                  id="edit-directory-entry-contact-name"
                  name="contactName"
                  component={TextField}
                  label={<FormattedMessage id="ui-directory.information.mainContactName" />}
                  parse={v => v}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Label>
                  <FormattedMessage id="ui-directory.information.addresses" />
                </Label>
                <FieldArray
                  name="addresses"
                  component={AddressListFieldArray}
                />
              </Col>
            </Row>
          </>
        </Accordion>
      </>
    );
  }
}

export default DirectoryEntryFormContactInfo;
