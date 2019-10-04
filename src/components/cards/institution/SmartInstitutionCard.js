import { get } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { stripesConnect } from '@folio/stripes/core';
import InstitutionCard from './InstitutionCard';

class SmartInstitutionCard extends React.Component {
  static manifest = {
    institution: {
      type: 'okapi',
      path: 'directory/entry?stats=true&filters=symbols.symbol=!{institutionSymbol}',
      throwErrors: false,
    },
  };

  static propTypes = {
    institutionSymbol: PropTypes.string,
    resources: PropTypes.shape({
      institution: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.object
        ),
      }),
    }),
  };

  render() {
    return <InstitutionCard institution={get(this.props, 'resources.institution.records.0.results.0')} {...this.props} />;
  }
}

export default stripesConnect(SmartInstitutionCard);
