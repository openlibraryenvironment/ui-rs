import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Accordion, Icon, MultiColumnList } from '@folio/stripes/components';
import css from './Flow.css';

const Volumes = ({
  request: {
    state: { code } = {},
    volumes = []
  } = {}
}) => {
  const { formatDate, formatMessage } = useIntl();
  
  if (volumes.length > 1) {
    
    /*
     * This is a function to take in a RequestVolume and determine,
     * from the request state code, whether that volume is in an acceptable state or not
     */
    const volumeStateStatus = (vol) => {
      if (code === "RES_AWAIT_PICKING" || "RES_AWAIT_PROXY_BORROWER" || "RES_AWAIT_SHIP") {
        // At this point, the ideal scenario is 'Checked in to ReShare'
        return vol.status.value === 'checked_in_to_reshare'
      }

      return false;
    }

    const volumeFormatter = {
      status: vol => {
        const vss = volumeStateStatus(vol)
        return (
          <>
            <Icon
              icon={vss ? 'check-circle' : 'exclamation-circle'}
              size="small"
              status={vss ? 'success' : 'warn'}
            >
              <FormattedMessage id={`ui-rs.flow.volumes.status.${vol.status.value}`} />
            </Icon>
          </>
        );
      }
    }

    return (
      <Accordion
        id="volumes"
        label={<FormattedMessage id="ui-rs.flow.sections.volumes" />}
      >
        <MultiColumnList
          columnMapping={{
            name: <FormattedMessage id="ui-rs.flow.volumes.label" />,
            itemId: <FormattedMessage id="ui-rs.flow.volumes.itemBarcode" />,
            status: <FormattedMessage id="ui-rs.flow.volumes.status" />,
          }}
          contentData={volumes}
          formatter={volumeFormatter}
          visibleColumns={['name', 'itemId', 'status']}
        />
      </Accordion>
    );
  }
  return null;
};

Volumes.propTypes = {
  request: PropTypes.shape({
    volumes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        itemId: PropTypes.string.isRequired,
        status: PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.string.isRequired
        }).isRequired
      }),
    ),
  }).isRequired,
};

export default Volumes;
