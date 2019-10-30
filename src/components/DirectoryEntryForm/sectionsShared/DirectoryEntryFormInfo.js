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

  state = {
    directoryEntryValues: [],
  }

  static getDerivedStateFromProps(props, state) {
    const { parentResources } = props;
    const newState = {};

    // TODO the blank option below is used to allow "unsetting" of parent whilst waiting for component https://issues.folio.org/browse/STCOM-576
    if (parentResources.records.records.length !== state.directoryEntryValues.length) {
      newState.directoryEntryValues = [
        { value: '', label: ''},
        ...parentResources.records.records.map(obj => ({ value: obj.id, label: obj.fullyQualifiedName })).filter( obj => {
          return obj.value !== parentResources.selectedRecord.records[0].id
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

  render() {
    console.log("State: %o", this.state);
    const { directoryEntryValues } = this.state;
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
