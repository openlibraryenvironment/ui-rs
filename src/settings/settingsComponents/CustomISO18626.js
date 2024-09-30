import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { ControlledVocab } from '@folio/stripes/smart-components';
import { Select } from '@folio/stripes/components';
import { IntlConsumer } from '@folio/stripes/core';

import { REFDATA_ENDPOINT } from '../../constants/endpoints';

class CustomISO18626 extends React.Component {
  static manifest = Object.freeze({
    refdatavalues: {
      type: 'okapi',
      path: REFDATA_ENDPOINT,
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
    const refdataValues = this.props?.resources?.refdatavalues?.records;
    const categoryName = refdataValues ? refdataValues.filter(obj => obj.id === e.target.value)[0]?.desc : '';
    this.setState({ categoryId: e.target.value, categoryName });
  }

  renderRowFilter(intl) {
    const custOptions = ['cannotSupplyReasons', 'loanConditions', 'customIdentifiersScheme'];
    const refdataValues = this.props?.resources?.refdatavalues?.records;
    const filteredList = refdataValues ? refdataValues.filter(obj => custOptions.includes(obj.desc)) : [];
    return (
      <Select
        dataOptions={[
          { value: 'empty', label: intl.formatMessage({ id: 'ui-rs.settings.customiseListSelect' }) },
          ...filteredList.map(c => ({ value: c.id, label: intl.formatMessage({ id: `ui-rs.settings.customiseListSelect.${c.desc}`, defaultMessage: c.desc }) })),
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
            baseUrl={`${REFDATA_ENDPOINT}/${this.state.categoryId}`}
            columnMapping={{
              label: intl.formatMessage({ id: 'ui-rs.settings.value' }),
              actions: intl.formatMessage({ id: 'ui-rs.settings.actions' }),
            }}
            // We have to unset the dataKey to prevent the props.resources in
            // <ControlledVocab> from being overwritten by the props.resources here.
            formatter={{ label: r => intl.formatMessage({ id: `ui-rs.settings.customiseListSelect.${this.state.categoryName}.${r.value}`, defaultMessage: r.label }) }}
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

export default injectIntl(CustomISO18626);
