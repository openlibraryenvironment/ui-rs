import React from 'react';
import PropTypes from 'prop-types';

import { Field, Form } from 'react-final-form';

import {
  Button,
  Card,
  Col,
  Row,
  Select,
  TextArea,
  TextField,
} from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';

class EditableSettingsList extends React.Component {
  

  state = {
    editing: []
  };

  renderSettingValue = (setting, i) => {
    return <p> {setting.value ? setting.value : <FormattedMessage id="ui-rs.settings.no-current-value" />} </p>;
  }

  renderEditSettingValue = (setting, i) => {
    const { editing } = this.state;
    const { initialValues, data } = this.props;

    // Grab the initial value of the setting
    const currentValue = initialValues.filter((obj) => {
      return (obj.key === setting.key);
    })[0].value;

    

    // We need to check if we are working with a String Setting or witha  refdata one
    if (setting.settingType === "String") {
      return < TextField value={currentValue} />
    } else {
      // Grab refdata values corresponding to setting
      const selectRefValues = data.refdatavalues.filter((obj) => { 
        return obj.desc === setting.vocab
      })[0].values
      return (
        <Select dataOptions={selectRefValues}/>
      );
    }
  }
  


  handleEditClick(i, submit, isSubmitClick) {
    const { editing } = this.state;

    this.setState(prevState => {
      const editingNew = [...prevState.editing];
      if ( editingNew[i] ) {
        editingNew[i] = !editingNew[i];
      } else {
        editingNew[i] = true;
      }
      return { editing: editingNew };
    });


    if (isSubmitClick === true) {
      return submit;
    } else {
      return undefined;
    }
  }

  renderEditButton(i, submitting, submit) {
    const { editing } = this.state;
    let EditText

    if ( editing[i] === true ) {
      EditText = <FormattedMessage id="ui-rs.settings.finish-editing"/>
      return (
        <Button
          type="submit" 
          onClick={(e) => {
            e.preventDefault()
            console.log("Form filled, submitting")
            return (
              this.handleEditClick(i, submit, true)
            );
          }}
          disabled={submitting}
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
              this.handleEditClick(i, submit, false)
            );
          }}
          disabled={submitting}
        >
          {EditText}
        </Button>
      );
    }
    
  }


  renderSettingList() {
    const { editing } = this.state;
    const settingList = this.props.data.settings.map((setting, i) => {
      const settingName = setting.key;

      let renderFunction;
      if (editing[i] === true) {
        renderFunction = this.renderEditSettingValue(setting, i);
      }
      else {
        renderFunction = this.renderSettingValue(setting, i)
      }

      return (
        <Form onSubmit={this.props.onSubmit}>
          {({handleSubmit, submitting}) => (
            <form id={`editable-setting-${settingName}`}>
              <Field
                name="value"
                render={props => {
                  return (
                    <Card
                      headerStart={settingName}
                      headerEnd={this.renderEditButton(i, submitting, this.props.onSubmit)}
                      hasMargin
                      roundedBorder
                    >
                      <Row>
                        <Col xs={12} md={6}>
                          {renderFunction}
                        </Col>
                      </Row>
                    </Card>
                  );
                }}
              />
          </form>
        )}
      </Form>
        );
      })
    return settingList;
  }


  render() {
    console.log("Editing: %o", this.state.editing)
    console.log("Props: %o", this.props)

    return (
      this.renderSettingList()
    );
  }



}



export default EditableSettingsList;