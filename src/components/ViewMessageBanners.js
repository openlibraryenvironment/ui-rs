import React from 'react';
import PropTypes from 'prop-types';
import { MessageBanner } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import SafeHTMLMessage from '@folio/react-intl-safe-html';

const ViewMessageBanners = ({ request }) => {
  const relevantPendingConditions = request.conditions?.filter(
    condition => condition.relevantSupplier?.id === request.resolvedSupplier?.id && condition.accepted !== true
  );

  const relevantAcceptedConditions = request.conditions?.filter(
    condition => condition.relevantSupplier?.id === request.resolvedSupplier?.id && condition.accepted === true
  );

  return (
    <>
      {request?.requesterRequestedCancellation ?
        <MessageBanner
          type="warning"
        >
          <FormattedMessage id="ui-rs.actions.requesterRequestedCancellation" />
        </MessageBanner> : null
      }
      {relevantPendingConditions.length > 0 ?
        <MessageBanner
          type="warning"
        >
          <SafeHTMLMessage id="ui-rs.actions.requestPendingLoanConditions" />
        </MessageBanner> : null
      }
      { /* It's not particularly useful to show two banners when there is a pending AND accepted request */}
      {relevantAcceptedConditions.length > 0 && relevantPendingConditions.length === 0 ?
        <MessageBanner
          type="success"
        >
          <SafeHTMLMessage id="ui-rs.actions.requestAcceptedLoanConditions" />
        </MessageBanner> : null
      }
    </>
  );
};

ViewMessageBanners.propTypes = {
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
    requesterRequestedCancellation: PropTypes.bool,
  }).isRequired,
};

export default ViewMessageBanners;
