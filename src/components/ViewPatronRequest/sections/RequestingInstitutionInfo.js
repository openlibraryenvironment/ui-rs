import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import InstitutionCard from './InstitutionCard';

import css from './RequestingInstitutionInfo.css';

class RequestingInstitutionInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
  };

  render() {
    const { record } = this.props;

    return (
      <InstitutionCard
        institution={get(record, 'resolvedRequester.owner')}
        cardClass={css.institutionCard}
        headerClass={css.institutionCardHeader}
      />
    );
  }
}

export default RequestingInstitutionInfo;
