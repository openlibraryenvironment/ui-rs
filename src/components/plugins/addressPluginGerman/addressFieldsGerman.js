import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid';
import { AddressTextField, requiredValidator } from '@k-int/address-utils';

const AddressFieldsGerman = ({ name, textFieldComponent }) => {
  return (
    <>
      <Row>
        <Col xs={6}>
          <AddressTextField
            name={name ? `${name}.institution` : 'institution'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.institution" />}
            component={textFieldComponent}
          />
        </Col>
        <Col xs={6}>
          <AddressTextField
            name={name ? `${name}.library` : 'library'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.library" />}
            component={textFieldComponent}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <AddressTextField
            name={name ? `${name}.department` : 'department'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.department" />}
            component={textFieldComponent}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <AddressTextField
            name={name ? `${name}.street` : 'street'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.street" />}
            component={textFieldComponent}
          />
        </Col>
        <Col xs={6}>
          <AddressTextField
            name={name ? `${name}.number` : 'number'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.number" />}
            component={textFieldComponent}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <AddressTextField
            name={name ? `${name}.zipCode` : 'zipCode'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.zipCode" />}
            component={textFieldComponent}
          />
        </Col>
        <Col xs={4}>
          <AddressTextField
            name={name ? `${name}.town` : 'town'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.town" />}
            component={textFieldComponent}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <AddressTextField
            name={name ? `${name}.country` : 'country'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.country" />}
            component={textFieldComponent}
            required
            validator={requiredValidator}
          />
        </Col>
      </Row>
    </>
  );
};

AddressFieldsGerman.propTypes = {
  name: PropTypes.string,
  savedAddress: PropTypes.shape({
    addressLabel: PropTypes.string,
    countryCode: PropTypes.string,
    id: PropTypes.string,
    lines: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.shape({
        value: PropTypes.string.isRequired
      }).isRequired,
      value: PropTypes.string.isRequired
    })),
  }),
  textFieldComponent: PropTypes.object
};

export default AddressFieldsGerman;
