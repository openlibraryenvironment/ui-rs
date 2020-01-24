import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from '@folio/stripes/components';

const RequesterSupplier = ({ request: req }) => {
  const requester = _.get(req, 'resolvedRequester.owner');
  if (!requester) return null;
  const supplier = _.get(req, 'resolvedSupplier.owner');
console.log(supplier)
  return (
    <Row>
      <Col xs={6}>
        <Card
          id="requester-card"
          headerEnd={<Link to={`/directory/entries/view/${requester.id}`}>View</Link>}
          headerStart={<FormattedMessage id="ui-rs.requester" />}
          roundedBorder
        >
          {requester.name}
        </Card>
      </Col>
      <Col xs={6}>
        <Card
          id="supplier-card"
          headerEnd={supplier && <Link to={`/directory/entries/view/${supplier.id}`}>View</Link>}
          headerStart={<FormattedMessage id="ui-rs.supplier" />}
          roundedBorder
        >
          {supplier ? supplier.name : <FormattedMessage id="ui-rs.cards.reqSup.searching" />}
        </Card>
      </Col>
    </Row>
  );
};

RequesterSupplier.propTypes = {
  request: PropTypes.object.isRequired,
};

export default RequesterSupplier;
