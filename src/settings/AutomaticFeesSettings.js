import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Layout, Pane } from '@folio/stripes/components';
import { useSettingSection } from '@k-int/stripes-kint-components';
import { EditableSettingsList } from '@k-int/stripes-kint-components/es/lib/EditableSettingsList';
import { SETTINGS_ENDPOINT } from '../constants/endpoints';

const AutomaticFeesSettings = () => {
  const { handleSubmit: handleSettingSubmit, settings } = useSettingSection({
    sectionName: 'automaticFees',
    settingEndpoint: SETTINGS_ENDPOINT
  });

  return (
    <Pane defaultWidth="fill" paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.automaticFees" />}>
      <Layout className="display-flex" style={{ 'flex-direction': 'column', gap: '1em' }}>
        <EditableSettingsList
          allowEdit
          initialValues={{ 'settings': settings }}
          intlKey="ui-rs"
          onSave={handleSettingSubmit}
          onSubmit={handleSettingSubmit}
          settingSection="automaticFees"
        />
      </Layout>
    </Pane>
  );
};

export default AutomaticFeesSettings;
