import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Col,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import { EditCard } from '@folio/stripes-erm-components';
import { isEmpty } from 'lodash';

const TERM_TYPE_TEXT = 'com.k_int.web.toolkit.custprops.types.CustomPropertyText'; // eslint-disable-line no-unused-vars
const TERM_TYPE_NUMBER = 'com.k_int.web.toolkit.custprops.types.CustomPropertyInteger';
const TERM_TYPE_SELECT = 'com.k_int.web.toolkit.custprops.types.CustomPropertyRefdata';

export default class CustPropsListField extends React.Component {
  static propTypes = {
    input: PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
      onChange: PropTypes.func,
    }),
    meta: PropTypes.object,
    availableCustProps: PropTypes.arrayOf(PropTypes.shape({
      description: PropTypes.string,
      label: PropTypes.string.isRequired,
      options: PropTypes.array,
      type: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      defaultInternal: PropTypes.bool,
    })).isRequired,
    tab: PropTypes.string,
  };

  state = {
    custprops: [],
    errors: {},
  }

  static getDerivedStateFromProps(props, state) {
    const {
      availableCustProps = [],
      tab,
    } = props;
    if (!state.dirtying) {
      const custPropsLocal = availableCustProps.filter(custprop => custprop.defaultInternal === true);
      const custPropsShared = availableCustProps.filter(custprop => custprop.defaultInternal === false);

      if (tab === 'local') {
        return {
          custprops: custPropsLocal
        };
      } else {
        return {
          custprops: custPropsShared
        };
      }
    }

    return null;
  }

  getCustProp = (custPropValue) => {
    return this.props.availableCustProps.find(custprop => custprop.value === custPropValue);
  }

  isInvalid = (values) => {
    const errors = {};

    this.state.custprops.forEach((custprop) => {
      const val = values ? values[custprop.value] : [];
      const { note, publicNote, value } = val ? val[0] : {};

      if (!custprop.primary && custprop.value && !value) {
        errors[custprop.value] = <FormattedMessage id="stripes-core.label.missingRequiredField" />;
      }

      if ((note && !value) || (publicNote && !value)) {
        errors[custprop.value] = <FormattedMessage id="ui-directory.errors.custPropsNoteWithoutValue" />;
      }
    });

    this.setState({ errors });

    return Object.keys(errors).length > 0;
  }

  renderCustPropValue = (custprop, i) => {
    const { input: { onChange, value } } = this.props;
    const { errors } = this.state;
    const currentValue = value[custprop.value] ? value[custprop.value][0] : {};

    // Initialise to just the value (for text/number values)
    // and then check if it's an object (for Select/refdata values).
    let controlledFieldValue = currentValue.value;
    if (controlledFieldValue && controlledFieldValue.value) {
      controlledFieldValue = controlledFieldValue.value;
    }

    // Figure out which component we're rendering and specify its unique props.
    let FieldComponent = TextArea;
    const fieldProps = {};
    if (custprop.type === TERM_TYPE_SELECT) {
      FieldComponent = Select;
      fieldProps.dataOptions = custprop.options;
    }

    if (custprop.type === TERM_TYPE_NUMBER) {
      FieldComponent = TextField;
      fieldProps.type = 'number';
    }

    const handleChange = e => {
      onChange({
        ...value,
        [custprop.value]: [{
          ...currentValue,
          _delete: e.target.value === '' ? true : undefined, // Delete custprop if removing the value.
          value: e.target.value
        }],
      });
    };

    return (
      <FieldComponent
        data-test-custprop-value
        id={`edit-custprop-${i}-value`}
        onChange={handleChange}
        value={controlledFieldValue}
        error={!isEmpty(errors) ? errors[custprop.value] : undefined}
        {...fieldProps}
      />
    );
  }

  renderCustProps() {
    const custPropsList = this.state.custprops.map((custprop, i) => {
      const header = custprop.label;
      return (
        <EditCard
          header={header}
          key={custprop.value}
        >
          <Row>
            <Col xs={12} md={6}>
              {this.renderCustPropValue(custprop, i)}
            </Col>
          </Row>
        </EditCard>
      );
    });
    return custPropsList;
  }

  render() {
    return (
      <div>
        {this.renderCustProps()}
      </div>
    );
  }
}
