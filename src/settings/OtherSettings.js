import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Layout, Pane } from '@folio/stripes/components';
import { useSettingSection } from '@k-int/stripes-kint-components';
import { EditableSettingsList } from '@k-int/stripes-kint-components/es/lib/EditableSettingsList';
import EditableRefdataList from '../components/EditableRefdataList';
import { REFDATA_ENDPOINT, SETTINGS_ENDPOINT } from '../constants/endpoints';

const OtherSettings = () => {
  const intl = useIntl();
  const { handleSubmit: handleSettingSubmit, settings } = useSettingSection({
    sectionName: 'other',
    settingEndpoint: SETTINGS_ENDPOINT
  });
  return (
    <Pane paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.other" />}>
      <Layout className="display-flex" style={{ 'flex-direction': 'column', gap: '1em' }}>
        <EditableRefdataList
          desc="cancellationReasons"
          refdataEndpoint={REFDATA_ENDPOINT}
          label={intl.formatMessage({ id: 'ui-rs.settings.other.cancellationReasons' })}
        />
        <EditableRefdataList
          desc="copyrightType"
          refdataEndpoint={REFDATA_ENDPOINT}
          label={intl.formatMessage({ id: 'ui-rs.settings.other.copyrightType' })}
        />
        <EditableSettingsList
          allowEdit
          initialValues={{ 'settings': settings }}
          intlKey="ui-rs"
          onSave={handleSettingSubmit}
          onSubmit={handleSettingSubmit}
          settingSection="other"
        />
      </Layout>
    </Pane>
  );
};

export default OtherSettings;
