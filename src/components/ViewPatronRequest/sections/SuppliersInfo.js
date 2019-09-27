import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import {
  Accordion,
  Card,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';


function supplierState(state) {
  if (!state) return '';
  const description = state.description;
  return description ? `${state.name} (${description})` : state.name;
}


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
            headerEnd={<Link to={`/directory/entries?qindex=symbols.symbol&query=${supplier.directoryId.replace(/.*:/, '')}`}>View in directory</Link>}
            roundedBorder
          >
            <Row>
              <Col xs={6}>
                <KeyValue
                  label="Branch"
                  value={supplier.directoryId}
                />
              </Col>
              <Col xs={6}>
                <KeyValue
                  label="Status"
                  value={supplierState({ name: 'Pending', description: 'Awaiting handling' })}
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
