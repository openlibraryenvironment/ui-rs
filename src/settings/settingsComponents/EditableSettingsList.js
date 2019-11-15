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

class EditableSettingsList extends React.Component {
  

  state = {
    editing: []
  };

  renderSettingValue = (setting, i) => {
    return <p> {setting.value} </p>;
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
      return null;
    }
  }

  renderEditButton(i, submitting, submit) {
    const { editing } = this.state;
    let EditText

    if ( editing[i] === true ) {
      EditText = "Finish Editing"
      return (
        <Button
          type="submit" 
          onClick={(e) => {
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
      EditText = "Edit"
      return (
        <Button
          onClick={(e) => {
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
      //console.log(this.props)
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
                      headerEnd={this.renderEditButton(i, submitting, handleSubmit)}
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
    console.log(this.state.editing)
    return (
      this.renderSettingList()
    );
  }



}



export default EditableSettingsList;