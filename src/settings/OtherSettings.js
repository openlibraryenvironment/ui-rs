import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { EditableRefdataList } from '@k-int/stripes-kint-components';
import { Pane } from '@folio/stripes/components';
import { REFDATA_ENDPOINT } from '../constants/endpoints';

const OtherSettings = () => {
  const intl = useIntl();
  return (
    <Pane paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.other" />}>
      <EditableRefdataList
        desc="cancellationReasons"
        refdataEndpoint={REFDATA_ENDPOINT}
        label={intl.formatMessage({ id: 'ui-rs.settings.other.cancellationReasons' })}
      />
    </Pane>
  );
};

export default OtherSettings;
