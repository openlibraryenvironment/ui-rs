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
    return <p>{setting.value}</p>;
  }

  renderEditSettingValue = (setting, i) => {
    const { editing } = this.state;
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
    const { editing } = this.state;
    const settingList = this.props.data.settings.map((setting, i) => {
      const settingName = setting.key;
      let EditText
      if ( editing[i] ) {
        if ( editing[i] === true ) {
          EditText = "Finish Editing"
        } else {
          EditText = "Edit"
        }
      } else {
        EditText = "Edit"
      }

      let renderFunction;
      if (editing[i] == true) {
        renderFunction = <p>Editing value {i}</p>
      }
      else {
        renderFunction = this.renderSettingValue(setting, i)
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
              {renderFunction}
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
        onSubmit={this.props.onSubmit}
      />
    );
  }



}



export default EditableSettingsList;