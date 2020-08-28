import React from 'react';
import PropTypes from 'prop-types';
import { MessageBanner } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

const ViewMessageBanners = ({ request }) => {
  return (
    <>
      {request?.requesterRequestedCancellation ?
        <MessageBanner
          type="warning"
        >
          <FormattedMessage id="ui-rs.actions.requesterRequestedCancellation" />
        </MessageBanner> : null
      }
      {request?.requesterRequestedCancellation ?
        <MessageBanner
          type="warning"
        >
          <FormattedMessage id="ui-rs.actions.requesterRequestedCancellation" />
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
