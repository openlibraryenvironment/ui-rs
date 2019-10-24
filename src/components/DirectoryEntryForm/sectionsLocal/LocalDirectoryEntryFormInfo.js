import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Field } from 'react-final-form';

import {
  Accordion,
  Col,
  Row,
  TextField,
} from '@folio/stripes/components';

import { required } from '../../../util/validators';

import { CustPropsListField } from './components';

class LocalDirectoryEntryFormInfo extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
    parentResources: PropTypes.shape({
      typeValues: PropTypes.object,
      selectedRecord: PropTypes.shape({
        records: PropTypes.array
      }),
      custprops: PropTypes.array,
    }),
  };

  constructor(props) {
    super(props);
    this.refToCustPropsListField = React.createRef();
    this.state = {
      custprops: [],
    };
  }

  getTypeValues() {
    return get(this.props.parentResources.typeValues, ['records'], [])
      .map(({ id, label }) => ({ label, value: id }));
  }

  static getDerivedStateFromProps(props, state) {
    const { custprops } = props.parentResources
    if (custprops.length !== state.custprops.length) {
      return {
        custprops: custprops.map((custprop) => {
          let options = get(custprop.category, ['values']);
          if (options) {
            options = [{
              label: <FormattedMessage id='ui-directory.notSet'/>,
              value: '',
            },
            ...options];
          }

          return {
            description: custprop.description,
            label: custprop.label,
            primary: custprop.primary,
            type: custprop.type,
            options,
            value: custprop.name,
            defaultInternal: custprop.defaultInternal,
          };
        }),
      };
    }

    return null;
  }

  render() {
    const { id, onToggle, open } = this.props;
    return (
      <Accordion
        id={id}
        label={<FormattedMessage id="ui-directory.information.local.heading.directoryEntry" />}
        open={open}
        onToggle={onToggle}
      >
        <React.Fragment>
          <Field
            name="customProperties"
            //validate={(value) => this.refToCustPropsListField.current && this.refToCustPropsField.current.isInvalid(value)}
            render={props => {
              return (
                <CustPropsListField
                  availableCustProps={this.state.custprops}
                  ref={this.refToCustPropsListField}
                  {...props}
                />
              );
            }}
          />
        </React.Fragment>
      </Accordion>
    );
  }
}

export default LocalDirectoryEntryFormInfo;
