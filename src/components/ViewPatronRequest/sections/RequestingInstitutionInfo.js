import React from 'react';
import PropTypes from 'prop-types';
import SmartInstitutionCard from '../../cards/institution/SmartInstitutionCard';

import css from './RequestingInstitutionInfo.css';

class RequestingInstitutionInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
  };

  render() {
    const { record } = this.props;

    return (
      <SmartInstitutionCard
        id={`${this.props.id}-card`}
        institutionSymbol={(record.requestingInstitutionSymbol || '').replace(/^RESHARE:/, '')}
        cardClass={css.institutionCard}
        headerClass={css.institutionCardHeader}
      />
    );
  }
}

export default RequestingInstitutionInfo;
