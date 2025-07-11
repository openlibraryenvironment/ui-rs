import { useSettings } from '@projectreshare/stripes-reshare';

const useActionConfig = () => {
  const allSettings = useSettings();
  if (!allSettings.isSuccess) return {};
  const settings = allSettings.data.filter(st => st.section === 'state_action_config');

  const returnObj = {};

  // eslint-disable-next-line no-return-assign
  settings.map(st => (returnObj[st.key] = st.value ?? st.defValue));
  return returnObj;
};

export default useActionConfig;
