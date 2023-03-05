import { Pane, Paneset } from '@folio/stripes/components';
import { useOkapiQuery } from '@reshare/stripes-reshare';
import { FormattedMessage } from 'react-intl';
import FileSetting from './FileSetting';

const PullslipConfiguration = () => {
  const { data: settings, isSuccess: settingsLoaded } = useOkapiQuery('rs/settings/appSettings', { searchParams: { filters: 'section==pullslipConfiguration' } });
  if (!settingsLoaded) return null;
  return (
    <Paneset>
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-rs.settings.settingsSection.pullslipConfiguration" />}
      >
        <FileSetting setting={settings.filter(s => s.key === 'pull_slip_logo_id')[0]} fileType="LOGO" />
        <FileSetting setting={settings.filter(s => s.key === 'pull_slip_report_id')[0]} fileType="REPORT_DEFINITION" />
      </Pane>
    </Paneset>
  );
};

export default PullslipConfiguration;
