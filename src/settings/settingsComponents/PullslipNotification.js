import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, Row, Col, KeyValue } from '@folio/stripes/components';


const dayname = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
};


class PullslipNotification extends React.Component {
  static propTypes = {
    record: PropTypes.shape({}).isRequired,
    intl: PropTypes.shape({
      formatTime: PropTypes.func.isRequired,
    }).isRequired,
  };

  render() {
    const { record, intl } = this.props;
    const formattedTimes = record.times
      .map(time => intl.formatTime(`1968-03-12T${time}Z`, { timeZone: 'GMT' }))
      .join(', ');

    return (
      <>
        <Card
          id="pullslip-notification"
          headerStart={record.name}
          headerEnd="[buttons go here]"
        >
          <Row>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.pullslipNotification.status" />}
                value={record.status ? 'Active' : 'Disabled'}
              />
            </Col>
            <Col xs={3}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.pullslipNotification.times" />}
                value={formattedTimes}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.pullslipNotification.days" />}
                value={record.days.map(code => dayname[code]).join(', ')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.pullslipNotification.locations" />}
                value={(record.locations || []).map(l => l.substr(0, 8)).join(', ')}
              />
            </Col>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.pullslipNotification.emailAddresses" />}
                value={record.emailAddresses.join(', ')}
              />
            </Col>
          </Row>
        </Card>

        <hr />
        <pre>
          {JSON.stringify(record, null, 2)}
        </pre>
      </>
    );
  }
}

export default injectIntl(PullslipNotification);
