import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Card, Row, Col } from '@folio/stripes/components';


const displayCondition = (condition) => {
  return (
    <Row>
      <Col xs={5}>
        <strong>
          <FormattedMessage id="ui-rs.loanConditions.condition" />
        </strong>
        {condition.code}
      </Col>
      <Col xs={2} />
      <Col xs={5}>
        <strong>
          <FormattedMessage id="ui-rs.loanConditions.note" />
        </strong>
        {condition.note}
      </Col>
    </Row>
  );
};

const LoanConditions = ({ request: req }) => {
  const { conditions } = req;
  return (
    <Row>
      <Col xs={6}>
        <Card
          id="conditions-card"
          headerStart={<FormattedMessage id="ui-rs.loanConditions" />}
          roundedBorder
        >
          {conditions.map(condition => displayCondition(condition))}
        </Card>
      </Col>
    </Row>
  );
};

LoanConditions.propTypes = {
  request: PropTypes.object.isRequired,
};

export default LoanConditions;
