import { useSettingSection } from '@k-int/stripes-kint-components';
import { SETTINGS_ENDPOINT } from '../../constants/endpoints';

const useActionConfig = () => {
  const { settings } = useSettingSection({
    sectionName: 'state_action_config',
    settingEndpoint: SETTINGS_ENDPOINT
  });

  const returnObj = {};

  // eslint-disable-next-line no-return-assign
  settings.map(st => (returnObj[st.key] = st.value ?? st.defValue));
  return returnObj;
};

export default useActionConfig;
