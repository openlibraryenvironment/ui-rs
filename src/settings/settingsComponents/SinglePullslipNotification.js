import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, IconButton, Row, Col, KeyValue } from '@folio/stripes/components';


const dayname = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
};


class SinglePullslipNotification extends React.Component {
  static propTypes = {
    record: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      status: PropTypes.string,
      times: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
      days: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
      locations: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ),
      emailAddresses: PropTypes.arrayOf(
        PropTypes.string.isRequired,
      ).isRequired,
    }).isRequired,
    timersMutator: PropTypes.shape({
      DELETE: PropTypes.func.isRequired,
    }).isRequired,
    intl: PropTypes.shape({
      formatTime: PropTypes.func.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  handleDelete(_event, id) {
    this.props.timersMutator.DELETE({ id })
      .then(() => {
        this.props.history.push(':id');
      });
  }

  renderActions(id) {
    return (
      <>
        <IconButton icon="edit" onClick={() => alert(1)} />
        <IconButton icon="trash" onClick={(e) => this.handleDelete(e, id)} />
      </>
    );
  }

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
          headerEnd={this.renderActions(record.id)}
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

export default withRouter(injectIntl(SinglePullslipNotification));
