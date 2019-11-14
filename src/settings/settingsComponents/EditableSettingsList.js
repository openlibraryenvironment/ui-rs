import React from 'react';
import PropTypes from 'prop-types';

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
    console.log("Setting: %o", setting)
    return (
      <p>{setting.value}</p>
    );
  }

  handleEditClick(i) {
    console.log(`handleEditClick called for setting ${i}`)
    this.setState(prevState => {
      const editing = [...prevState.editing];
      editing[i] = true;
      return { editing };
    });
  }


  renderSettingList() {
    const settingList = this.props.data.settings.map((setting, i) => {
      const settingName = setting.key;
      return (
        <Card
        headerStart={settingName}
        headerEnd={<Button onClick={this.handleEditClick(i)}>Edit</Button>}
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
      this.renderSettingList()
    );
  }



}



export default EditableSettingsList;