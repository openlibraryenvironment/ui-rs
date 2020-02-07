import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select } from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

class CustomISO18626 extends React.Component {
  static manifest = Object.freeze({
    refdatavalues: {
      type: 'okapi',
      path: 'rs/refdata',
      params: {
        max: '500',
      },
    }
  });

  static propTypes = {
    stripes: PropTypes.shape({
      connect: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      refdatavalues: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.shape({
          id: PropTypes.string,
          desc: PropTypes.string,
          values: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            value: PropTypes.string,
            label: PropTypes.string,
          })),
        })),
      }),
    })
  };

  constructor(props) {
    super(props);
    this.connectedControlledVocab = props.stripes.connect(ControlledVocab);

    this.state = {
      categoryId: null,
    };
  }

  onChangeCategory = (e) => {
    this.setState({ categoryId: e.target.value });
  }

  renderRowFilter(intl) {
    const custOptions = ['cannotSupplyReasons'];
    const refdataValues = this.props?.resources?.refdatavalues?.records;
    const filteredList = refdataValues ? refdataValues.filter(obj => custOptions.includes(obj.desc)) : [];

    return (
      <Select
        dataOptions={[
          { value: 'empty', label: intl.formatMessage({ id: 'ui-rs.settings.customiseListSelect' }) },
          ...filteredList.map(c => ({ value: c.id, label: c.desc })),
        ]}
        id="categorySelect"
        label={<FormattedMessage id="ui-rs.settings.customiseList" />}
        name="categorySelect"
        onChange={this.onChangeCategory}
      />
    );
  }

  render() {
    return (
      <IntlConsumer>
        {intl => (
          <this.connectedControlledVocab
            {...this.props}
            actuatorType="refdata"
            baseUrl={`rs/refdata/${this.state.categoryId}`}
            columnMapping={{
              label: intl.formatMessage({ id: 'ui-rs.settings.value' }),
              actions: intl.formatMessage({ id: 'ui-rs.settings.actions' }),
            }}
            // We have to unset the dataKey to prevent the props.resources in
            // <ControlledVocab> from being overwritten by the props.resources here.
            dataKey={undefined}
            hiddenFields={['lastUpdated', 'numberOfObjects']}
            id="custom-iso18626"
            label={<FormattedMessage id="ui-rs.settings.customISO18626" />}
            labelSingular={intl.formatMessage({ id: 'ui-rs.settings.value' })}
            listSuppressor={() => !this.state.categoryId}
            nameKey="label"
            objectLabel={<FormattedMessage id="ui-rs.settings.values" />}
            records="values"
            rowFilter={this.renderRowFilter(intl)}
            sortby="label"
            stripes={this.props.stripes}
            visibleFields={['label']}
          />
        )}
      </IntlConsumer>
    );
  }
}

export default CustomISO18626;
