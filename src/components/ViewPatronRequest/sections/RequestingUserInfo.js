import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Accordion } from '@folio/stripes/components';
import SmartUserCard from '../../cards/user/SmartUserCard';

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
        <SmartUserCard id="requestingUserInfo-card" userId={record.patronReference} />
      </Accordion>
    );
  }
}

export default RequestingUserInfo;
