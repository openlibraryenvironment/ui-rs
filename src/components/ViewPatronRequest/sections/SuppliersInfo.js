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

import css from './SuppliersInfo.css';


function supplierState(state) {
  if (!state) return '';
  const s = state.code.replace(/^REQ_/, '').replace(/_/g, ' ');
  return s[0].toUpperCase() + s.substring(1).toLowerCase();
}


class SuppliersInfo extends React.Component {
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
        label={<FormattedMessage id="ui-rs.information.heading.suppliers" />}
        closedByDefault={this.props.closedByDefault}
      >
        {((record || {}).rota || []).sort((a, b) => a.rotaPosition - b.rotaPosition).map((supplier, i) => (
          <Card
            key={i}
            id={`${this.props.id}-card`}
            headerStart={`Supplier ${i + 1}`}
            headerEnd={<Link to={`/directory/entries?qindex=symbols.symbol&query=${supplier.directoryId.replace(/.*:/, '')}`}>View in directory</Link>}
            roundedBorder
            cardClass={css.supplierCard}
            headerClass={css.supplierCardHeader}
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
                  value={supplierState(supplier.state)}
                />
              </Col>
            </Row>
          </Card>
        ))}
      </Accordion>
    );
  }
}

export default SuppliersInfo;
