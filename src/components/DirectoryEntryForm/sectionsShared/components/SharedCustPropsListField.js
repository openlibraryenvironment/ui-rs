import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { IntlConsumer } from '@folio/stripes/core';
import {
  Button,
  Col,
  KeyValue,
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

export default class SharedCustPropsListField extends React.Component {
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
  };

  state = {
    custprops: [],
    errors: {},
  }

  static getDerivedStateFromProps(props, state) {
    const {
      input: { value },
      meta: { pristine },
      availableCustProps = [],
    } = props;
    if (pristine && !state.dirtying) {
      return {
        custprops: availableCustProps.filter(custprop => custprop.defaultInternal === false),
      };
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
        label={<FormattedMessage id="ui-directory.information.local.custPropValue" />}
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
      //console.log("Cust Prop Label: ", custprop.label)
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

    return custPropsList
    
  }

  

  /* renderCustProps = (custPropType) => {
    let optionalCustPropCounter = 0;

    const custPropsList = this.state.custprops.map((custprop, i) => {
      if (custPropType === 'primary' && !custprop.primary) return undefined;
      if (custPropType === 'optional' && custprop.primary) return undefined;

      const deleteBtnProps = custPropType === 'optional' ? {
        'id': `edit-custprop-${i}-delete`,
        'data-test-custprop-delete-btn': true
      } : null;

      const header = custPropType === 'optional' ?
        <FormattedMessage id="ui-directory.custprop.title" values={{ number: optionalCustPropCounter + 1 }} /> :
        custprop.label;

      return (
        <EditCard
          header={header}
          key={custprop.value}
          onDelete={custPropType === 'optional' ? () => this.handleDeleteCustProp(custprop, i) : null}
        >

          <Row>
            <Col xs={12} md={6}>
              {this.renderCustPropValue(custprop, i)}
            </Col>
          </Row>
        </EditCard>
      );
    }).filter(custprop => custprop !== undefined);

    return custPropsList;
  } */

  render() {
    return (
      <div>
        {this.renderCustProps()}
      </div>
    );
  }
}
