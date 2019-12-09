import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import { Accordion } from '@folio/stripes/components';
import InstitutionCard from '../../cards/institution/InstitutionCard';

import css from './RequestingInstitutionInfo.css';

class RequestingInstitutionInfo extends React.Component {
  static propTypes = {
    record: PropTypes.object,
    id: PropTypes.string,
    closedByDefault: PropTypes.bool,
  };

  render() {
    const { record } = this.props;

    return (
      <Accordion
        id={this.props.id}
        label={<FormattedMessage id="ui-rs.information.heading.requestinginstitution" />}
        closedByDefault={this.props.closedByDefault}
      >
        <InstitutionCard
          institution={get(record, 'resolvedRequester.owner')}
          cardClass={css.institutionCard}
          headerClass={css.institutionCardHeader}
        />
      </Accordion>
    );
  }
}

export default RequestingInstitutionInfo;
