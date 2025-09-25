import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { MessageBanner } from '@folio/stripes/components';
import { useStripes } from '@folio/stripes/core';
import useActionConfig from './Flow/useActionConfig';

const ViewMessageBanners = ({ request }) => {
  const stripes = useStripes();
  // eslint-disable-next-line camelcase
  const { combine_fill_and_ship } = useActionConfig();
  // eslint-disable-next-line camelcase
  const combine = combine_fill_and_ship === 'yes';
  const lastCostStates = ['RES_COPY_AWAIT_PICKING', combine ? 'RES_AWAIT_PICKING' : 'RES_AWAIT_SHIP'];
  const lastChanceForCost = stripes.config?.reshare?.useTiers && stripes.config?.reshare?.showCost && lastCostStates.includes(request?.state?.code);

  const currentSupplier = request.resolvedSupplier?.id ?? request.supplyingInstitutionSymbol;

  const relevantPendingConditions = request.conditions?.filter(
    condition => currentSupplier === (condition.relevantSupplier?.id ?? condition.supplyingInstitutionSymbol) && condition.accepted === false
  );

  const relevantAcceptedConditions = request.conditions?.filter(
    condition => currentSupplier === (condition.relevantSupplier?.id ?? condition.supplyingInstitutionSymbol) && condition.accepted === true
  );

  const cancellationRequested = request?.state?.code === 'RES_CANCEL_REQUEST_RECEIVED';

  const dueTooSoon = request.parsedDueDateRS
    && request?.state?.code === 'RES_AWAIT_SHIP'
    && new Date(request.parsedDueDateRS) - Date.now() < 1000 * 60 * 60 * 24 * 7;

  const renderConditionsBanner = () => {
    if (relevantPendingConditions && relevantPendingConditions.length > 0) {
      return (
        <MessageBanner
          type="warning"
        >
          <FormattedMessage id="ui-rs.actions.requestPendingLoanConditions" />
        </MessageBanner>
      );
    } else if (relevantAcceptedConditions && relevantAcceptedConditions.length > 0) {
      /* It's not particularly useful to show two banners when there is a pending AND accepted request */
      return (
        <MessageBanner
          type="success"
        >
          <FormattedMessage id="ui-rs.actions.requestAcceptedLoanConditions" />
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
      {dueTooSoon &&
        <MessageBanner
          type="warning"
        >
          <FormattedMessage id="ui-rs.actions.checkIn.dueTooSoon" />
        </MessageBanner>
      }
      {lastChanceForCost &&
        <MessageBanner
          type="warning"
        >
          <FormattedMessage id="ui-rs.view.banners.lastChanceCost" />
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
