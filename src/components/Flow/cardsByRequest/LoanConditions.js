import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, Row, Col } from '@folio/stripes/components';
import css from './CardFormatting.css';
import { formatConditionCode, formatConditionNote } from '../../../util/formatCondition';


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
          {formatConditionCode(condition, formatMessage)}
        </Col>
        <Col xs={2} />
        {condition.note &&
          <Col xs={5}>
            <strong>
              <FormattedMessage id="ui-rs.loanConditions.note" />
            </strong>
            {formatConditionNote(condition)}
          </Col>
        }
      </Row>
    );
  };

  const currentSupplier = request.resolvedSupplier?.id;
  if (currentSupplier && conditions.length > 0) {
    return (
      <Card
        id="conditions-card"
        headerStart={<FormattedMessage id="ui-rs.loanConditions" />}
        headerClass={css.loanConditionHeader}
        className={css.loanConditionCard}
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
    );
  }
  return null;
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
