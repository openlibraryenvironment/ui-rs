import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'react-final-form';
import { Select } from '@folio/stripes/components';

import {
  Accordion,
  Col,
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

  constructor() {
    super();
    this.state = {
      directoryEntryValues: [],
      searchedParentValue: '',
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
    const { directoryEntryValues, searchedParentValue } = this.state;
    const  entriesOptions = this.props.parentResources.records.records;
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
              <FormattedMessage id="ui-directory.information.name">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-name"
                    name="name"
                    label={placeholder}
                    component={TextField}
                    placeholder={placeholder}
                    required
                    validate={required}
                  />
                )}
              </FormattedMessage>
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
              {/* <SearchField
                onClear={this.clearValue}
                value={searchedParentValue}
                onChange={this.changeValue}
                placeholder="Search to filter direcotry entries"
                ariaLabel="Search for stuff."
                clearSearchId="clear-parent-search-button"
                id="clear-parent-search-field"
                searchableIndexes={{label: 'Name', value: 'name'}}
              /> */}
              <FormattedMessage id="ui-directory.information.parent">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-parent"
                    name="parent"
                    label={placeholder}
                    component={Select}
                    dataOptions={directoryEntryValues}
                    placeholder={placeholder}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
        </React.Fragment>
      </Accordion>
    );
  }
}

export default DirectoryEntryFormInfo;
