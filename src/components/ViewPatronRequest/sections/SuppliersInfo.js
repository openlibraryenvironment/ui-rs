import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';


class PatronRequestInfo extends React.Component {
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
        label={<FormattedMessage id="ui-rs.information.heading.suppliers" />}
        open={this.props.open}
        onToggle={this.props.onToggle}
      >
        {((record || {}).rota || []).sort((a, b) => a.rotaPosition - b.rotaPosition).map((supplier, i) => (
          <Card
            key={i}
            id={`${this.props.id}-card`}
            headerStart={`Supplier ${i + 1}`}
            roundedBorder
          >
            <Row>
              <Col xs={6}>
                <KeyValue
                  label={<FormattedMessage id="ui-rs.information.itemId" />}
                  value={supplier.systemIdentifier}
                />
              </Col>
              <Col xs={6}>
                <KeyValue
                  label={<FormattedMessage id="ui-rs.information.state" />}
                  value={(supplier.state || {}).name}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <KeyValue
                  label={<FormattedMessage id="ui-rs.information.availability" />}
                  value={supplier.availability}
                />
              </Col>
              <Col xs={6}>
                <KeyValue
                  label={<FormattedMessage id="ui-rs.information.shelfMark" />}
                  value={supplier.shelfmark}
                />
              </Col>
            </Row>
          </Card>
        ))}
      </Accordion>
    );
  }
}

export default PatronRequestInfo;
