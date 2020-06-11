import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
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
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.object.isRequired,
        ),
      }),
      lmsLocations: PropTypes.shape({
        hasLoaded: PropTypes.bool.isRequired,
        records: PropTypes.arrayOf(
          PropTypes.object.isRequired,
        ),
      }),
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
    lmsLocations: {
      type: 'okapi',
      path: 'rs/hostLMSLocations',
      params: {
        perPage: '100',
      }
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
        <Link to="../pullslip-notifications">
          <IconButton icon="times" />
        </Link>
        <span>{record.name}</span>
      </>
    );
  }

  headerEnd(record) {
    return (
      <>
        <Link to={`${record.id}/edit`}>
          <IconButton icon="edit" title="Edit in place" />
        </Link>
        <Link to={`/supply/pullslip-notifications/${record.id}/edit`}>
          <IconButton icon="search" title="Edit full screen" />
        </Link>
        <IconButton icon="trash" title="Delete" onClick={(e) => this.handleDelete(e, record.id)} />
      </>
    );
  }

  render() {
    const { timer, lmsLocations } = this.props.resources;
    if (!timer || !timer.hasLoaded || !lmsLocations || !lmsLocations.hasLoaded) return null;

    const locationId2Name = {};
    lmsLocations.records.forEach(x => { locationId2Name[x.id] = x.name; });

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
                value={record.days.map(code => dayname[code]).join(', ')}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6}>
              <KeyValue
                label={<FormattedMessage id="ui-rs.pullslipNotification.locations" />}
                value={(record.locations || []).map(l => locationId2Name[l]).join(', ')}
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
