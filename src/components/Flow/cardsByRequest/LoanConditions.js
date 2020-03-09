import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, Row, Col } from '@folio/stripes/components';


const LoanConditions = (props) => {
  const request = props?.request;
  const { conditions } = request;

  const displayCondition = (condition) => {
    const { formatMessage } = props.intl;
    return (
      <Row>
        <Col xs={5}>
          <strong>
            <FormattedMessage id="ui-rs.loanConditions.condition" />
          </strong>
          {formatMessage({ id: `ui-rs.settings.customiseListSelect.loanConditions.${condition.code}`, defaultMessage: condition.code })}
        </Col>
        <Col xs={2} />
        {condition.note &&
          <Col xs={5}>
            <strong>
              <FormattedMessage id="ui-rs.loanConditions.note" />
            </strong>
            {condition.note}
          </Col>
        }
      </Row>
    );
  };

  const currentSupplier = request.resolvedSupplier.id

  return (
    <Row>
      <Col xs={6}>
        <Card
          id="conditions-card"
          headerStart={<FormattedMessage id="ui-rs.loanConditions" />}
          roundedBorder
        >
          {conditions.map(condition => {
            // We only want to display the conditions relevant to the current supplier
            const conditionSupplier = condition.relevantSupplier?.id;
            if (conditionSupplier === currentSupplier) {
              return displayCondition(condition);
            }
            return null;
          })}
        </Card>
      </Col>
    </Row>
  );
};

LoanConditions.propTypes = {
  request: PropTypes.shape({
    conditions: PropTypes.arrayOf({
      id: PropTypes.string,
      code: PropTypes.string,
      relevantSupplier: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
    resolvedSupplier: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func.isRequired
  })
};

export default injectIntl(LoanConditions);
