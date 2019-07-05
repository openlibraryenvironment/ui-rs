import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import GraphQLUserCard from '../../cards/user/GraphQLUserCard';

import css from './RequestingUserInfo.css';

class RequestingUserInfo extends React.Component {
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
        label={<FormattedMessage id="ui-rs.information.heading.requester" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        <GraphQLUserCard
          id="requestingUserInfo-card"
          userId={record.patronReference}
          cardClass={css.userCard}
          headerClass={css.userCardHeader}
        />
      </Accordion>
    );
  }
}

export default RequestingUserInfo;
