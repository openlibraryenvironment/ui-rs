import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Row, Col } from 'react-flexbox-grid';
import { AddressTextField } from '@k-int/address-utils';
import backendToFields from "./backendToFields";

const AddressFieldsGerman = ({ name, requiredValidator, savedAddress, textFieldComponent }) => {
  const initialValues = backendToFields(savedAddress);
  return (
    <>
      <Row>
        <Col xs={6}>
          <AddressTextField
            name={name ? `${name}.premise` : 'premise'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.institutionLibrary" />}
            component={textFieldComponent}
            initialValue={initialValues.premise}
          />
        </Col>
        <Col xs={6}>
          <AddressTextField
              name={name ? `${name}.department` : 'department'}
              label={<FormattedMessage id="ui-directory.address-plugin-german.department" />}
              component={textFieldComponent}
              initialValue={initialValues.department}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <AddressTextField
            name={name ? `${name}.thoroughfare` : 'thoroughfare'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.streetNumber" />}
            component={textFieldComponent}
            initialValue={initialValues.thoroughfare}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={4}>
          <AddressTextField
            name={name ? `${name}.postalcode` : 'postalcode'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.zipCode" />}
            component={textFieldComponent}
            initialValue={initialValues.postalcode}
          />
        </Col>
        <Col xs={4}>
          <AddressTextField
            name={name ? `${name}.postalcodeortown` : 'postalcodeortown'}
            label={<FormattedMessage id="ui-directory.address-plugin-german.town" />}
            component={textFieldComponent}
            initialValue={initialValues.postalcodeortown}
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
            initialValue={initialValues.country}
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
