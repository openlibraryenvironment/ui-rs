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

  const cancellationRequested = request?.state?.code === 'RES_CANCEL_REQUEST_RECEIVED';

  const renderConditionsBanner = () => {
    if (relevantPendingConditions.length > 0) {
      return (
        <MessageBanner
          type="warning"
        >
          <SafeHTMLMessage id="ui-rs.actions.requestPendingLoanConditions" />
        </MessageBanner>
      );
    } else if (relevantAcceptedConditions.length > 0) {
      /* It's not particularly useful to show two banners when there is a pending AND accepted request */
      return (
        <MessageBanner
          type="success"
        >
          <SafeHTMLMessage id="ui-rs.actions.requestAcceptedLoanConditions" />
        </MessageBanner>
      );
    }
    return null;
  };

  return (
    <>
      {cancellationRequested &&
        <MessageBanner
          type="warning"
        >
          <FormattedMessage id="ui-rs.actions.requesterRequestedCancellation" />
        </MessageBanner>
      }
      {renderConditionsBanner()}
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
