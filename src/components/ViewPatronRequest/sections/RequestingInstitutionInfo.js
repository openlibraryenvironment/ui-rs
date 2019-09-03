import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import SmartInstitutionCard from '../../cards/institution/SmartInstitutionCard';

import css from './RequestingInstitutionInfo.css';

class RequestingInstitutionInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    onToggle: PropTypes.func,
    open: PropTypes.bool,
  };

  render() {
    const { record } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.requestinginstitution" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <SmartInstitutionCard
          id="requestingInstitutionInfo-card"
          institutionSymbol={record.requestingInstitutionSymbol}
          cardClass={css.institutionCard}
          headerClass={css.institutionCardHeader}
        />
      </Accordion>
    );
  }
}

export default RequestingInstitutionInfo;
