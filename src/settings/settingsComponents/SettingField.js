import React from 'react';
import PropTypes from 'prop-types';

import { Field, Form } from 'react-final-form';
import setFieldData from 'final-form-set-field-data';

import stripesFinalForm from '@folio/stripes/final-form';

import {
  Button,
  Card,
  Col,
  Pane,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';

export default class SettingField extends React.Component {
  state = {
    editing: false
  };

  renderSettingValue = (setting) => {
    return <p> {setting.value ? setting.value : <FormattedMessage id="ui-rs.settings.no-current-value" />} </p>;
  }

  renderEditSettingValue = (setting) => {
    const { initialValues, data } = this.props;
    // Grab the initial value of the setting
    const currentValue = initialValues.settings.filter((obj) => {
      return (obj.key === setting.key);
    })[0].value;

    // We need to check if we are working with a String Setting or witha  refdata one
    if (setting.settingType === "String") {
      return (
        <Field
          name={`${this.props.input.name}`}
          component={TextField}
        />
      );
    } else {
      // Grab refdata values corresponding to setting
      const selectRefValues = data.refdatavalues.filter((obj) => { 
        return obj.desc === setting.vocab
      })[0].values
      return (
        <Field 
          name={`${this.props.input.name}`}
          component={Select}
          dataOptions={selectRefValues}
        />
      );
    }
  }


  renderEditButton() {
    const { editing } = this.state;
    let EditText

    if ( editing === true ) {
      EditText = <FormattedMessage id="ui-rs.settings.finish-editing"/>
      return (
        <Button
          type="submit" 
          onClick={(e) => {
            e.preventDefault()
            console.log("Form filled, submitting")
            return (
              this.handleSave()
            );
          }}
        >
          {EditText}
        </Button>
      );
    } else {
      EditText = <FormattedMessage id="ui-rs.settings.edit"/>
      return (
        <Button
          onClick={(e) => {
            e.preventDefault()
            console.log("Switching to edit mode")
            return (
              this.setState({editing: true})
            );
          }}
        >
          {EditText}
        </Button>
      );
    }
    
  }

  handleSave = () => {
    console.log("handleSave called in SettingField")
    this.props.onSave()
      .then(() => this.setState({ editing: false }))
  }


  render() {
    const { currentSetting } = this.props.data
    let setting;
    if (currentSetting[0]) {
      setting = currentSetting[0];
    } else {
      setting = {};
    }

    let renderFunction;
    if (this.state.editing === false) {
      renderFunction = this.renderSettingValue(setting);
    } else {
      renderFunction = this.renderEditSettingValue(setting);
    }
    return (
      <Card
        headerStart={currentSetting[0] ? currentSetting[0].key : "Setting Name Loading"}
        headerEnd={this.renderEditButton()}
        hasMargin
        roundedBorder
      >
        <Row>
          <Col xs={12}>
            {renderFunction}
          </Col>
        </Row>
      </Card>
    );
  }
}

