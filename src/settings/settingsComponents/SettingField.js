import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';

import {
  Button,
  Card,
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';

export default class SettingField extends React.Component {
  static propTypes = {
    initialValues: PropTypes.object,
    data: PropTypes.shape({
      refdatavalues: PropTypes.arrayOf(PropTypes.object),
      currentSetting: PropTypes.object
    }),
    input: PropTypes.object
  };

  state = {
    editing: false
  };

  renderSettingValue = (setting) => {
    return (
      <p>
        {setting.value ? setting.value : <FormattedMessage id="ui-rs.settings.no-current-value" />}
      </p>
    );
  }

  renderEditSettingValue = (setting) => {
    const { initialValues, data } = this.props;

    // We need to check if we are working with a String Setting or witha  refdata one
    if (setting.settingType === "String") {
      return (
        <Field
          name={`${this.props.input.name}`}
          component={TextField}
          parse={v => v} // Lets us send an empty string instead of 'undefined'
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
    this.props.onSave()
      .then(() => this.setState({ editing: false }))
  }


  render() {
    const { currentSetting } = this.props.data
    let setting;
    if (currentSetting) {
      setting = currentSetting;
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
        headerStart={currentSetting ? currentSetting.key : "Setting Name Loading"}
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

