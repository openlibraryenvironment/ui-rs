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
        {((record || {}).rota || []).map((supplier, i) => (
          <Card
            id={`${this.props.id}-card`}
            headerStart={`Supplier ${i + 1}`}
            roundedBorder
          >
            <Row>
              <Col xs={6}>
                <KeyValue
                  label="Item ID"
                  value={supplier.systemIdentifier}
                />
              </Col>
              <Col xs={6}>
                <KeyValue
                  label="State"
                  value={supplier.state.name}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={6}>
                <KeyValue
                  label="Availability"
                  value={supplier.availability}
                />
              </Col>
              <Col xs={6}>
                <KeyValue
                  label="Shelf mark"
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
