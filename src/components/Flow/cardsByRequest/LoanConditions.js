import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Card, Row, Col } from '@folio/stripes/components';
import css from './CardFormatting.css';


const LoanConditions = (props) => {
  const request = props?.request;
  const { conditions } = request;

  const stripOutSystemKey = (note) => {
    let returnedNote = note;
    if (note.startsWith('#ReShareAddLoanCondition#')) {
      const re = new RegExp('#[\\s\\S]*?#');
      returnedNote = note.replace(re, '');
    }
    return returnedNote;
  };

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
            {stripOutSystemKey(condition.note)}
          </Col>
        }
      </Row>
    );
  };

  const currentSupplier = request.resolvedSupplier.id;
  if (conditions.length > 0) {
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
