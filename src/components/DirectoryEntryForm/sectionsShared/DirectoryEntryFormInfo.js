import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'react-final-form';
import { Select, FormattedUTCDate } from '@folio/stripes/components';

import {
  Accordion,
  Col,
  MessageBanner,
  Row,
  SearchField,
  TextField,
} from '@folio/stripes/components';

import { required } from '../../../util/validators';

class DirectoryEntryFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
    }),
  };

  constructor(props) {
    super(props);

    this.state = {
      directoryEntryValues: [],
      selectedParent: '',
      warning: '',
    };
    this.clearValue = this.clearValue.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    const { parentResources } = props;
    const newState = {};

    // TODO the blank option below is used to allow "unsetting" of parent whilst waiting for component https://issues.folio.org/browse/STCOM-576
    if (parentResources.records.records.length !== state.directoryEntryValues.length) {
      newState.directoryEntryValues = [
        { value: '', label: ''},
        ...parentResources.records.records.map(obj => ({ value: obj.id, label: obj.fullyQualifiedName })).filter( obj => {
          if (parentResources.selectedRecord.records[0]) {
            return obj.value !== parentResources.selectedRecord.records[0].id
          } else {
            return obj.value
          }
        }),
      ]
    }
    if (Object.keys(newState).length) return newState;

    return null;
  }

  getTypeValues() {
    return get(this.props.parentResources.typeValues, ['records'], [])
      .map(({ id, label }) => ({ label, value: id }));
  }



  clearValue() {
    this.setState({
      searchedParentValue: '',
    });
  }

  changeValue(e) {
    this.setState({
      searchedParentValue: e.target.value,
      directoryEntryValues: directoryEntryValues.filter(obj => {return obj.label.includes(e.target.value)})
    });

  }

  changeIndex(e) {
    this.setState({
      selectedIndex: e.target.value,
    });
  }

  render() {
    console.log("State: %o", this.state)
    console.log("Props: %o", this.props)
    const { directoryEntryValues, selectedParent, warning } = this.state;
    const  entriesOptions = this.props.parentResources.records.records;
    const { values } = this.props;
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <React.Fragment>
          <Row>
            <Col xs={5}>
              <Field
                id="edit-directory-entry-name"
                name="name"
                label={<FormattedMessage id="ui-directory.information.name"/>}
                validate={required}
                required
              >
                {props => (
                  <TextField
                    {...props}
                    onChange={(e) => {
                      props.input.onChange(e);
                      const { value } = e.target;
                      let warning='';

                      if (value!=null && selectedParent.includes(value)) {
                        warning = <FormattedMessage id="ui-directory.information.parent.warning" />
                      }
                      this.setState({ warning });
                      
                    }}
                    placeholder="Name"
                  />
                )}
                
              </Field>
            </Col>
            <Col xs={2}>
             (Status)
            </Col>
            <Col xs={5}>
              <FormattedMessage id="ui-directory.information.slug">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-slug"
                    name="slug"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    required
                    validate={required}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <Field
                id="edit-directory-entry-parent"
                name="parent"
                label={<FormattedMessage id="ui-directory.information.parent" />}
              >
                {props => (
                  <Select
                    {...props}
                    dataOptions={directoryEntryValues}
                    onChange={(e) => {
                      props.input.onChange(e);
                      const { value } = e.target;
                      const valueObj = directoryEntryValues.filter(obj => {
                        return obj.value == value
                      });
                      const valueName = valueObj[0].label
                      this.setState({ selectedParent: valueName })
                      console.log("value: %o", valueName)

                      let warning='';

                      if (values.name!=null && valueName.includes(values.name)) {
                        warning = <FormattedMessage id="ui-directory.information.parent.warning" />
                      }
                      this.setState({ warning });
                    }}
                    placeholder=" "
                  />
                )}
              </Field>
            </Col>
          </Row>
          {warning ? <MessageBanner type="warning"> {warning} </MessageBanner> : null}
        </React.Fragment>
      </Accordion>
    );
  }
}

export default DirectoryEntryFormInfo;
