import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { stripesConnect } from '@folio/stripes/core';
import { Pane, Card, IconButton, Row, Col, KeyValue } from '@folio/stripes/components';
import { raw2userData } from './util';


const dayname = {
  Mo: 'Monday',
  Tu: 'Tuesday',
  We: 'Wednesday',
  Th: 'Thursday',
  Fr: 'Friday',
  Sa: 'Saturday',
  Su: 'Sunday',
};


class ViewPullslipNotification extends React.Component {
  static propTypes = {
    intl: PropTypes.shape({
      formatTime: PropTypes.func.isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    resources: PropTypes.shape({
      timer: PropTypes.shape({
        records: PropTypes.arrayOf(
          PropTypes.shape({
            specificRecord: PropTypes.shape({
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
            }),
          }).isRequired,
        ),
      })
    }).isRequired,
    mutator: PropTypes.shape({
      timer: PropTypes.shape({
        DELETE: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  static manifest = {
    timer: {
      type: 'okapi',
      path: 'rs/timers/:{id}',
    },
  };

  handleDelete(_event, id) {
    this.props.mutator.timer.DELETE({ id });
    // We do NOT want to wait till the DELETE has finished using
    // then(), otherwise we get an attempted re-render before we
    // navigate to the other page.
    this.props.history.push('../pullslip-notifications');
  }

  headerStart(record) {
    return (
      <>
        <IconButton icon="times" onClick={() => this.props.history.push('../pullslip-notifications')} />
        <span>{record.name}</span>
      </>
    );
  }

  headerEnd(record) {
    return (
      <>
        <IconButton icon="edit" onClick={() => this.props.history.push(`${record.id}/edit`)} />
        <IconButton icon="trash" onClick={(e) => this.handleDelete(e, record.id)} />
      </>
    );
  }

  render() {
    const timer = this.props.resources.timer;
    if (!timer || !timer.hasLoaded) return null;

    const record = raw2userData(timer.records[0]);
    const formattedTimes = record.times
      .map(time => this.props.intl.formatTime(`1968-03-12T${time}Z`, { timeZone: 'GMT' }))
      .join(', ');

    return (
      <Pane defaultWidth="fill">
        <Card
          id="pullslip-notification"
          headerStart={this.headerStart(record)}
          headerEnd={this.headerEnd(record)}
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
                value={record.days.split(',').map(code => dayname[code]).join(', ')}
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
      </Pane>
    );
  }
}

export default withRouter(injectIntl(stripesConnect(ViewPullslipNotification)));
