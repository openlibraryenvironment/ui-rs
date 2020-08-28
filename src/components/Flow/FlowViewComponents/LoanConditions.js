import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Accordion, MultiColumnList } from '@folio/stripes/components';
import { formatConditionCode, formatConditionNote } from '../../../util/formatCondition';


const LoanConditions = (props) => {
  const { formatDate, formatMessage } = useIntl();
  const request = props?.request;
  const { conditions } = request;

  const currentSupplier = request.resolvedSupplier?.id;
  if (currentSupplier && conditions.length > 0) {
    // We only want to display loanConditions on the record that are relevant to the current supplier.
    // We then sort these by dateCreated, with newest at the top
    const relevantConditions = conditions.filter(
      condition => condition.relevantSupplier?.id === currentSupplier
    ).sort((a, b) => {
      return (
        (a.dateCreated > b.dateCreated) ? -1 : ((a.dateCreated < b.dateCreated) ? 1 : 0)
      );
    });
    const conditionFormatter = {
      code: cond => formatConditionCode(cond, formatMessage),
      note: cond => formatConditionNote(cond),
      dateCreated: cond => formatDate(cond.dateCreated),
      accepted: cond => cond.accepted ? <FormattedMessage id="ui-rs.flow.loanConditions.status.accepted" /> : <FormattedMessage id="ui-rs.flow.loanConditions.status.pending" />}
    };

    return (
      <Accordion
        id="loanConditions"
        label={<FormattedMessage id="ui-rs.flow.sections.loanConditions" />}
      >
        <MultiColumnList
          columnMapping={{
            code: <FormattedMessage id="ui-rs.flow.loanConditions.condition" />,
            note: <FormattedMessage id="ui-rs.flow.loanConditions.note" />,
            dateCreated: <FormattedMessage id="ui-rs.flow.loanConditions.dateReceived" />,
            accepted: <FormattedMessage id="ui-rs.flow.loanConditions.status" />,
          }}
          contentData={relevantConditions}
          formatter={conditionFormatter}
          visibleColumns={['code', 'dateCreated', 'accepted', 'note']}
        />
      </Accordion>
    );
  }
  return null;
};

LoanConditions.propTypes = {
  request: PropTypes.shape({
    conditions: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        code: PropTypes.string,
        relevantSupplier: PropTypes.shape({
          id: PropTypes.string,
        }),
      }),
    ),
    resolvedSupplier: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default LoanConditions;
