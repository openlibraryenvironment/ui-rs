import React from 'react';
import PropTypes from 'prop-types';

import { Field } from 'react-final-form';

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
    const { editing } = this.state;
      if (editing[i] == true) {
        return <p> Edit Stuff</p>;
      }
      else {
        return <p>{setting.value}</p>;
      }
  }

  handleEditClick(i) {
    this.setState(prevState => {
      const editing = [...prevState.editing];
      if ( editing[i] ) {
        editing[i] = !editing[i];
      } else {
        editing[i] = true;
      }
      return { editing };
    });
  }


  renderSettingList() {
    const settingList = this.props.data.settings.map((setting, i) => {
      const settingName = setting.key;
      let EditText
      if ( this.state.editing[i] ) {
        if ( this.state.editing[i] === true ) {
          EditText = "Finish Editing"
        } else {
          EditText = "Edit"
        }
      } else {
        EditText = "Edit"
      }

      return (
        <Card
        headerStart={settingName}
        headerEnd={<Button onClick={(e) => this.handleEditClick(i)}>{EditText}</Button>}
        hasMargin
        roundedBorder
        >
          <Row>
            <Col xs={12} md={6}>
              {this.renderSettingValue(setting, i)}
            </Col>
          </Row>
        </Card>
      );
    });
    return settingList;
  }


  render() {
    console.log("EditableSettingsList props: %o", this.props)
    console.log("EditableSettingsList state: %o", this.state)

    return (
      <Field
        name="value"
        render={props => {
          return (
            this.renderSettingList()
          );
        }}
      />
    );
  }



}



export default EditableSettingsList;