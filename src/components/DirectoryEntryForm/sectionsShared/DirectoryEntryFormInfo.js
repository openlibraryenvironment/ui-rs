import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';

import {
  Accordion,
  Col,
  Label,
  MessageBanner,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { SymbolListField } from '../components';

import { required } from '../../../util/validators';
import getRefdataValuesFromParentResources from '../../../util/getRefdataValuesFromParentResources';

class DirectoryEntryFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
      query: PropTypes.shape({
        layer: PropTypes.string,
      }),
      records: PropTypes.object,
    }),
    values: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      directoryEntryValues: [],
      selectedParent: '',
      warning: '',
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { parentResources, values } = props;
    const newState = {};

    // TODO the blank option below is used to allow "unsetting" of parent whilst waiting for component https://issues.folio.org/browse/STCOM-576
    if (parentResources.records.records.length !== state.directoryEntryValues.length) {
      newState.directoryEntryValues = [
        { value: '', label: '' },
        ...parentResources.records.records.map(obj => ({ value: obj.id, label: obj.fullyQualifiedName })).filter(obj => {
          if (values) {
            return obj.value !== values.id;
          } else {
            return obj.value;
          }
        }),
      ];
    }
    if (Object.keys(newState).length) return newState;

    return null;
  }

  getCurrentLayer() {
    const layer = this.props?.parentResources?.query?.layer;
    return layer;
  }

  render() {
    const { directoryEntryValues, selectedParent, warning } = this.state;
    const { values } = this.props;
    const layer = this.getCurrentLayer();
    const namingAuthorities = this.props?.parentResources?.namingAuthorities?.records.map(obj => ({ value: obj.id, label: obj.symbol }));

    const directoryEntryTypes = getRefdataValuesFromParentResources(this.props.parentResources, 'DirectoryEntry.Type');
    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-directory.information.heading.directoryEntry" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <>
          <Row>
            <Col xs={4}>
              <Field
                id="edit-directory-entry-name"
                name="name"
                label={<FormattedMessage id="ui-directory.information.name" />}
                validate={required}
                required
              >
                {props => (
                  <TextField
                    {...props}
                    onChange={(e) => {
                      props.input.onChange(e);
                      const inputValue = e.target.value;
                      let warningMessage = '';

                      if (inputValue != null && selectedParent.includes(inputValue)) {
                        warningMessage = <FormattedMessage id="ui-directory.information.parent.warning" />;
                      }
                      this.setState({ warning: warningMessage });
                    }}
                    placeholder="Name"
                  />
                )}

              </Field>
            </Col>
            <Col xs={4}>
              <FormattedMessage id="ui-directory.information.type">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-type"
                    name="type"
                    label={placeholder[0]}
                    component={Select}
                    dataOptions={directoryEntryTypes}
                    placeholder={placeholder[0]}
                  />
                )}
              </FormattedMessage>
            </Col>
            <Col xs={4}>
              <FormattedMessage id="ui-directory.information.slug">
                {placeholder => (
                  <Field
                    id="edit-directory-entry-slug"
                    name="slug"
                    label={placeholder[0]}
                    component={TextField}
                    placeholder={placeholder[0]}
                    disabled={layer === 'edit'}
                    required
                    validate={required}
                  />
                )}
              </FormattedMessage>
            </Col>
          </Row>
          <Row>
            {this.props.values?.parent ?
              <Col xs={4}>
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

                        // The below is finding the selected index and then grabbing the label of that element (saves doing a separate lookup)
                        const selectedValue = e.target[e.target.selectedIndex].text;
                        this.setState({ selectedParent: selectedValue });

                        let warningMessage = '';

                        if (values.name != null && selectedValue.includes(values.name)) {
                          warningMessage = <FormattedMessage id="ui-directory.information.parent.warning" />;
                        }
                        this.setState({ warning: warningMessage });
                      }}
                      placeholder=" "
                      disabled
                    />
                  )}
                </Field>
              </Col> : ''
            }
            <Col xs={4}>
              <Field
                id="edit-directory-entry-lms-location-code"
                name="lmsLocationCode"
                component={TextField}
                label={<FormattedMessage id="ui-directory.information.lmsLocationCode" />}
                parse={v => v}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Label>
                <FormattedMessage id="ui-directory.information.symbols" />
              </Label>
              <FieldArray
                name="symbols"
              >
                {({ fields, input, meta }) => <SymbolListField {... { fields, input, meta, namingAuthorities }} /> }
              </FieldArray>
            </Col>
          </Row>
          {warning ? (
            <MessageBanner type="warning">
              {' '}
              {warning}
              {' '}
            </MessageBanner>) : null
          }
        </>
      </Accordion>
    );
  }
}

export default DirectoryEntryFormInfo;
