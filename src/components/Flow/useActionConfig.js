import { useSettingSection } from '@k-int/stripes-kint-components/src/lib/hooks';
import { SETTINGS_ENDPOINT } from '../../constants/endpoints';

const useActionConfig = () => {
  const { settings } = useSettingSection({
    sectionName: 'state_action_config',
    settingEndpoint: SETTINGS_ENDPOINT
  });

  const returnObj = {};

  settings.map(st => returnObj[st.key] = st.value ?? st.defValue);
  return returnObj;
};

export default useActionConfig;
