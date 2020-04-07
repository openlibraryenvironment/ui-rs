import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Button,
  Select,
  TextField,
} from '@folio/stripes/components';

import { EditCard, withKiwtFieldArray } from '@folio/stripes-erm-components';

import { required } from '../../../util/validators';

class SymbolListField extends React.Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
      map: PropTypes.func,
    })),
    namingAuthorities: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })),
    onAddField: PropTypes.func.isRequired,
  };

  renderAddSymbol = () => {
    return (
      <Button
        id="add-symbol-btn"
        onClick={() => this.props.onAddField()}
      >
        <FormattedMessage id="ui-directory.information.symbols.add" />
      </Button>
    );
  }

  render() {
    const { items, namingAuthorities } = this.props;
    return (
      <>
        {items?.map((symbol, index) => {
          return (
            <EditCard
              header={<FormattedMessage id="ui-directory.information.symbol.index" values={{ index }} />}
              key={`symbols[${index}].editCard`}
            >
              <Field
                name={`symbols[${index}].authority`}
                component={Select}
                dataOptions={[{ value:'', label: '' }, ...namingAuthorities]}
                label={<FormattedMessage id="ui-directory.information.symbols.authority" />}
                format={v => v?.id}
                required
                validate={required}
              />
              <Field
                name={`symbols[${index}].symbol`}
                label={<FormattedMessage id="ui-directory.information.symbols.symbol" />}
                component={TextField}
                required
                validate={required}
              />
            </EditCard>
          );
        })}
        {this.renderAddSymbol()}
      </>
    );
  }
}

export default withKiwtFieldArray(SymbolListField);
